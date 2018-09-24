// (+new Date($0.value)).toString(10).substring(0, 10)

const url = document.getElementById('url');
const btn = document.getElementById('btn');
const out = document.getElementById('out');

btn.onclick = () => {

    const data = {
        url: url.value
    }

    const f = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }

    fetch(`${location.origin}/api`, f)
    .then(r => r.json())
    .then(r => {
        if (r.url) {
            out.value = r.url;
        } else {
            out.value = 'Invalid input';
        }
    })
    .catch(e => {
        console.error(e);
        out.value = 'Error';
    });

}

url.onkeydown = e => {

    if (e.keyCode === 13) {

        btn.onclick();

    }

}
