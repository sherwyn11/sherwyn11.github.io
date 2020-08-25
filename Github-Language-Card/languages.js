(function(){

    class Card {

        constructor(username){
            this.username = username;
            this.vals = {};
        }

        async create() {
            var count = 0;
            getData('https://api.github.com/users/' + this.username + '/repos')
            .then(async (repos) => {
                    for(const repo of repos) {
                        getData(repo.languages_url)
                        .then(data => {
                            count += 1;
                            var keys = Object.keys(data);
                            for (const key of keys) {
                                if(Object.keys(this.vals).includes(key)){
                                    this.vals[key] += data[key];
                                }else{
                                    this.vals[key] = data[key];
                                }
                            }
                            if(count === repos.length){
                                console.log('done');                    
                               this.show();
                            }
                        });
                    }
            });
        }

        show() {
            var adds = [];
            var colors = [' yellow darken-2', ' blue darken-2', ' red darken-2', ' green-danger', ' purple darken-2'];
            var temp = [];

            var keys = Object.keys(this.vals);
            var sum = 0;
            let i = 0;
            for(const key of keys) {
                sum += this.vals[key];
                temp.push({ 'key': key, value: this.vals[key], color: colors[i] });
                i += 1;
                i = i % colors.length;
            }

            for(let i = 0; i < temp.length - 1; i++) {
                for(let j = i + 1; j < temp.length; j++) {
                    if(temp[i].value < temp[j].value){
                        let x = temp[i];
                        temp[i] = temp[j];
                        temp[j] = x;
                    }
                }
            }

            if (temp.length > 5) {
                temp = temp.slice(0, 5);
            }

            for(const t of temp) {
                t.value = (t.value / sum).toFixed(4);
                var div1 = document.createElement('div');
                var div2 = document.createElement('div');
                var div3 = document.createElement('div');
                var p1 = document.createElement('p');
                var p2 = document.createElement('p');

                p1.innerHTML = `<b><i>${t.key}</i></b>`;

                div2.className = "progress ";
                div3.className = "determinate " + t.color;
                div3.role = "progressbar";
                div3.style.width = `${t.value * 100}%`;
                div3.style.height = 50;
                div3.setAttribute('aria-valuenow', t.value * 100);
                div3.setAttribute('aria-valuemin', 0);
                div3.setAttribute('aria-valuemax', 100);

                div2.appendChild(div3);
                div1.appendChild(p1);
                div1.appendChild(div2);
                p2.innerHTML = "";
                div2.appendChild(p2);
                div1.appendChild(div2);

                adds.push(div1);
            }

            var div = document.getElementById('language-card');
            var card = document.createElement('div');
            var h = document.createElement('h4');
            h.innerHTML = 'Languages I use daily';
            card.className = 'card medium';
            card.style.width = '360px';
            var cardBody = document.createElement('div');
            cardBody.className = 'card-content';
            for(const elem of adds){
                cardBody.appendChild(elem);
            }

            card.appendChild(h);
            card.appendChild(cardBody);
            div.appendChild(card);            
        }
    }


     
    async function getData(url) {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        });
        return response.json();
    }

    window.onload = async function() {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css";
        link.media = 'all';

        document.head.appendChild(link);

        var username = document.getElementById('language-card').getAttribute('username');
        var card = new Card(username);
        await card.create();
    }

}());