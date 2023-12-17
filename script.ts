interface Enot {
    name: string;
    weight: number;
    year: number;
    imageURL?: string;
}

let enotsArray: Enot[] = [];

if (localStorage.getItem('enots')) {
    enotsArray = JSON.parse(localStorage.getItem('enots')!) as Enot[];
}

function saveEnotsToLocalStorage() {
    localStorage.setItem('enots', JSON.stringify(enotsArray));
}

function displayImage(image_url: string) {
    let imageElement = document.createElement('img');
    imageElement.src = image_url;

    let imageContainer = document.getElementById('imageContainer');
    imageContainer!.innerHTML = '';
    imageContainer!.appendChild(imageElement);
}

function generateAndSaveImages(enotIndex: number) {
    const api_url: string = "https://visioncraftapi--vladalek05.repl.co";
    const api_key: string = "c43fa8a3-fd8b-4117-9732-3b1415e4e641";

    const enot: Enot = enotsArray[enotIndex];
    const model: string = "absolutereality_v1.8.1";
    const sampler: string = "LMS";
    const image_count: number = 1;
    const cfg_scale: number = 8;
    const steps: number = 30;
    const loras: Record<string, number> = { "3DMM_V12": 1, "GrayClay_V1.5.5": 2, "eye_size_slider_v1": 3, "age_slider_v20": 1 };

    const data = {
        "model": model,
        "sampler": sampler,
        "prompt": `Draw a beautiful cute raccoon by <br> name ${enot.name} and he is this <br>weight ${enot.weight} kilogram, <br> and so old ${enot.year}.`,
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
    let name: string = (document.getElementById('enotik') as HTMLInputElement).value;
    let weight: number = Math.floor(Math.random() * 10);
    let year: number = Math.floor(Math.random() * 10);
    let enot: Enot = {
        name: name,
        weight: weight,
        year: year,
    };

    enotsArray.push(enot);

    saveEnotsToLocalStorage();
    generateAndSaveImages(enotsArray.length - 1);
}

function displayEnotInfo(enot: Enot) {
    let infoEnot = document.getElementById('photoenot');
    infoEnot!.innerHTML = `Вашего енота зовут ${enot.name}, он весит ${enot.weight}кг, его возраст - ${enot.year}`;

    let enotsList = document.getElementById('enotsList');
    let enotButton = document.createElement('button');
    enotButton.innerHTML = `Показать информацию о ${enot.name}`;
    enotButton.onclick = function() {
        showEnotInfo(enot);
    };

    let newLine = document.createElement('br');
    enotsList!.appendChild(newLine);

    enotsList!.appendChild(enotButton);
}

function showEnotInfo(enot: Enot) {
    let infoEnot = document.getElementById('photoenot');
    infoEnot!.innerHTML = `Вашего енота зовут ${enot.name}, он весит ${enot.weight} кг, его возраст - ${enot.year}`;

    function displayImage(imageURL: string) {
        let imageContainer = document.getElementById('imageContainer');
        imageContainer!.innerHTML = '';

        let image = document.createElement('img');
        image.src = imageURL;
        image.alt = enot.name!;
        imageContainer!.appendChild(image);
    }

    displayImage(enot.imageURL!);
}

window.onload = function() {
    localStorage.removeItem('enots');
};