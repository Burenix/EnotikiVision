let enotsArray = [];
        if (localStorage.getItem('enots')) {
            enotsArray = JSON.parse(localStorage.getItem('enots'));
        }

        function saveEnotsToLocalStorage() {
            localStorage.setItem('enots', JSON.stringify(enotsArray));
        }

        function displayImage(image_url) {
            let imageElement = document.createElement('img');
            imageElement.src = image_url;

            let imageContainer = document.getElementById('imageContainer');
            imageContainer.innerHTML = '';
            imageContainer.appendChild(imageElement);
        }

        function generateAndSaveImages(enotIndex) {
            const api_url = "https://visioncraftapi--vladalek05.repl.co";
            const api_key = "c43fa8a3-fd8b-4117-9732-3b1415e4e641";

            const enot = enotsArray[enotIndex];
            const model = "absolutereality_v1.8.1";
            const sampler = "Euler";
            const image_count = 1;
            const cfg_scale = 8;
            const steps = 30;
            const loras = { "3DMM_V12": 1, "GrayClay_V1.5.5": 2, "eye_size_slider_v1": 3, "age_slider_v20": 1 };

            const data = {
                "model": model,
                "sampler": sampler,
                "prompt": `Animal raccoon`,
                "image_count": image_count,
                "token": api_key,
                "cfg_scale": cfg_scale,
                "steps": steps,
                "loras": loras
            };

            fetch(`${api_url}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const image_url = data.images[0];

                enot.imageURL = image_url;
                saveEnotsToLocalStorage();
                displayEnotInfo(enot);
                displayImage(image_url); // Отображаем изображение на странице
            })
            .catch(error => {
                console.error('Error generating images:', error);
            });
        }

        function clickEnotik() {
            let name = document.getElementById('enotik').value;
            let weight = Math.floor(Math.random() * 10);
            let year = Math.floor(Math.random() * 10);
            let enot = {
                name: name,
                weight: weight,
                year: year,
            };

            enotsArray.push(enot);

            saveEnotsToLocalStorage();
            generateAndSaveImages(enotsArray.length - 1);
        }

        function displayEnotInfo(enot) {
            let infoEnot = document.getElementById('photoenot');
            infoEnot.innerHTML = `Вашего енота зовут ${enot.name}, он весит ${enot.weight}кг, его возраст - ${enot.year}`;

            let enotsList = document.getElementById('enotsList');
            let enotButton = document.createElement('button');
            enotButton.innerHTML = `Показать информацию о ${enot.name}`;
            enotButton.onclick = function() {
                showEnotInfo(enot);
            };

            let newLine = document.createElement('br');
            enotsList.appendChild(newLine);

            enotsList.appendChild(enotButton);
        }

        function showEnotInfo(enot) {
            let infoEnot = document.getElementById('photoenot');
            infoEnot.innerHTML = `Вашего енота зовут ${enot.name}, он весит ${enot.weight} кг, его возраст - ${enot.year}`;
        
            function displayImage(imageURL) {
                let imageContainer = document.getElementById('imageContainer');
                imageContainer.innerHTML = '';
        
                let image = document.createElement('img');
                image.src = imageURL;
                image.alt = enot.name;
                imageContainer.appendChild(image);
            }
        
            displayImage(enot.imageURL); 
        }

        window.onload = function() {
            localStorage.removeItem('enots');
        };
