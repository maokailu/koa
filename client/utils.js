const request = (route, params) => {
    const promise = new Promise(function(resolve, reject) {
        const handler = function() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        let host= 'http://localhost:3000/';
        let path = host + route;
        client.open('POST', path);
        client.onreadystatechange = handler;
        client.responseType = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        client.withCredentials = true;
        const json = JSON.stringify(params);
        json ? client.send(json) : client.send();
    });
    return promise;
};

export {
    request
};
