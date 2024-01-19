
const handleApiCall = (req, res, fetch) => {
    const PAT = 'd84d40505ddf416e87dd305a2284a512';
    const USER_ID = 'wnjg1dv9mam4';
    const APP_ID = 'smart-brain';
    const MODEL_ID = 'face-detection';
    //const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = req.body.input;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, requestOptions)
        .then(response => response.text())
        .then(data => {
            res.json(data);
            //console.log(data);
        })
        .catch(error => {
            res.status(400).json('unable to work with API');
    });
}

const handleImage = (req, res, db) => {
    const { id, input } = req.body;
    let increment = false;

    if (input) {
        increment = true;
    }

    db('users').where('id', '=', id)
        .increment('entries', increment ? 1 : 0)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => {
            res.status(400).json('Unable to get entries');
        });
}

module.exports = {
    handleImage,
    handleApiCall
}