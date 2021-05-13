// Constants

const leftMenuActivationWidth = 50;

// Classes

const ComponentRepo = repoString => {
    let repo = {};

    repo.elem = document.querySelector(repoString);

    repo.load = componentClass => {
        return repo.elem.querySelector(`.${componentClass}`).cloneNode(true);
    }

    return repo;
}

const Component = (repo, componentClass) => {
    let component = {};

    component.elem = repo.load(componentClass);

    component.appendTo = elem => {
        elem.appendChild(component.elem);
    }

    return component;
}

const AudioComponent = (repo, url) => {
    let component = Component(repo, "audio");

    if (url === null || url === undefined){
        component.audio = new Audio();
    }
    else {
        component.audio = new Audio(url);
    }

    component.isPlaying = () => ! component.audio.paused;
    component.play = () => {
        component.audio.play();
        component.elem.querySelector(".audio_play").classList.add("hidden");
        component.elem.querySelector(".audio_pause").classList.remove("hidden");
    };
    component.pause = () => {
        component.audio.pause();
        component.elem.querySelector(".audio_pause").classList.add("hidden");
        component.elem.querySelector(".audio_play").classList.remove("hidden");
    };
    component.setSrc = url => component.audio.src = url;

    component.audio.loop = true;
    component.elem.addEventListener("click", () => {
        if (component.isPlaying()){
            component.pause();
        }
        else {
            component.play();
        }
    });
    component.elem.querySelector(".audio_pause").classList.add("hidden");

    return component;
}

const ModalComponent = (repo) => {
    let component = Component(repo, "modal");

    component.show = () => {
        document.querySelector("#mask").classList.add("show");
        component.elem.classList.add("show");
    }
    component.hide = () => {
        document.querySelector("#mask").classList.remove("show");
        component.elem.classList.remove("show");
    }
    component.setHeight = height => {
        component.elem.style.height = height;
        let modalHeight = component.elem.clientHeight;
        component.elem.style.top = `calc((100% - ${modalHeight}px)/2)`;
    }
    component.setWidth = width => {
        component.elem.style.width = width;
        let modalWidth = component.elem.clientWidth;
        component.elem.style.left = `calc((100% - ${modalWidth})px/2)`;
    }
    component.append = elem => component.elem.querySelector(".modal_body").appendChild(elem);
    component.setTitle = title => component.elem.querySelector(".modal_title").textContent = title;

    component.elem.querySelector(".modal_close").addEventListener("click", component.hide);

    return component;
}

// Functions

const fetchRandomMix = () => {
    return new Promise((resolve, reject) => {
        fetch("/mix/random")
        .then(res => {
            return res.blob();
        })
        .then(blob => {
            resolve(blob);
        })
        .catch(err => {
            reject(err);
        })
    });
}

const showLeftMenu = () => {
    document.querySelector("#left_menu").classList.remove("retracted");
}

const hideLeftMenu = () => {
    document.querySelector("#left_menu").classList.add("retracted");
}

const showMask = () => {
    document.querySelector("#mask").classList.add("show");
}

const hideMask = () => {
    document.querySelector("#mask").classList.remove("show");
}

// On page load

document.querySelector("#close_left_menu").addEventListener("click", hideLeftMenu);
document.querySelector("#open_left_menu").addEventListener("click", showLeftMenu);

let repo = ComponentRepo("#component_repo");

let modal = ModalComponent(repo);
let elem = document.createElement("p");
elem.textContent = "test";
modal.append(elem);
modal.appendTo(document.body);
modal.show();

// let audio = AudioComponent(repo);

// fetchRandomMix()
// .then(blob => {
//     let url = URL.createObjectURL(blob);
//     audio.setSrc(url);
//     audio.appendTo(document.querySelector("#go_here"));
// });
