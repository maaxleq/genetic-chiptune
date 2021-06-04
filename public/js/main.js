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

    component.genome = null;
    component.disabed = false;

    component.setGenome = genome => component.genome = genome;
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
    component.disable = () => {
        component.elem.classList.add("disabled");
        component.disabled = true;
    }
    component.enable = () => {
        component.elem.classList.remove("disabled");
        component.disabled = false;
    }

    component.audio.loop = true;
    
    component.elem.querySelectorAll(".audio_play, .audio_pause").forEach(elem => {
        elem.addEventListener("click", () => {
            if (! component.disabled){
                if (component.isPlaying()){
                    component.pause();
                }
                else {
                    component.play();
                }
            }
        });
    });

    component.elem.querySelector(".audio_pause").classList.add("hidden");

    return component;
}

const ModalComponent = repo => {
    let component = Component(repo, "modal_container");

    component.show = () => {
        document.querySelector("#mask").classList.add("show");
        component.elem.querySelector(".modal").classList.add("show");
    }
    component.hide = () => {
        document.querySelector("#mask").classList.remove("show");
        component.elem.querySelector(".modal").classList.remove("show");
    }
    component.setHeight = height => {
        component.elem.querySelector(".modal").style.height = height;
    }
    component.setWidth = width => {
        component.elem.querySelector(".modal").style.width = width;
    }
    component.append = elem => component.elem.querySelector(".modal_body").appendChild(elem);
    component.setTitle = title => component.elem.querySelector(".modal_title").textContent = title;

    component.elem.querySelector(".modal_close").addEventListener("click", component.hide);

    return component;
}

const ResetModalComponent = repo => {
    let component = ModalComponent(repo);

    component.elem.querySelector(".modal_body").classList.add("reset_modal_body");

    component.setTitle(text.resetModal.title);
    component.formSubmittedFunction = () => {};

    component.setFormSubmittedFunction = func => {
        component.formSubmittedFunction = func;
    }

    let message = document.createElement("p");
    message.textContent = text.resetModal.message;
    component.append(message);

    let howMany = document.createElement("p");
    howMany.textContent = text.resetModal.howMany;
    howMany.style.marginTop = ""
    component.append(howMany);

    let form = document.createElement("form");
    form.method = "POST";
    form.action = "/evol/new";

    let input = document.createElement("input");
    input.class="reset_modal_count";
    input.type = "number";
    input.min = "8";
    input.step = "1";
    input.value = "8";
    input.name = "count";
    input.style.width = "100%";
    input.addEventListener("keyup", () => {

    });
    input.required = true;

    let button = document.createElement("button");
    button.type = "submit";
    button.textContent = text.resetModal.ok;
    button.style.marginTop = "100px";

    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-end";
    buttonContainer.style.width = "100%";
    buttonContainer.append(button);

    form.append(input);
    form.append(buttonContainer);

    form.addEventListener("submit", event => {
        event.preventDefault();
        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
        })
        .then(res => {
            component.formSubmittedFunction();
            component.hide();
        });
    });

    component.append(form);

    return component;
}

const RandomModalComponent = repo => {
    let component = ModalComponent(repo);

    component.elem.querySelector(".modal_body").classList.add("random_modal_body");

    component.setTitle(text.randomModal.title);

    let message = document.createElement("p");
    message.textContent = text.randomModal.message;
    component.append(message);

    let button = document.createElement("button");
    button.textContent = text.randomModal.regenerate;
    button.style.marginTop = "60px";

    let randomAudio = AudioComponent(repo);
    randomAudio.elem.classList.add("smaller");
    randomAudio.elem.style.margin = "50px 0px";

    fetchRandomMix()
        .then(blob => {
            let url = URL.createObjectURL(blob);
            randomAudio.setSrc(url);
        })
        .catch(err => {
            console.log(err);
    });

    let audioContainer = document.createElement("div");
    audioContainer.style.display = "flex";
    audioContainer.style.justifyContent = "center";
    audioContainer.style.width = "100%";
    audioContainer.append(randomAudio.elem);

    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-start";
    buttonContainer.style.width = "100%";
    buttonContainer.append(button);

    component.append(audioContainer);
    component.append(buttonContainer);

    button.addEventListener("click", () => {
        randomAudio.pause();
        fetchRandomMix()
        .then(blob => {
            let url = URL.createObjectURL(blob);
            randomAudio.setSrc(url);
        })
        .catch(err => {
            console.log(err);
        });
    });

    return component;
}

const GenesModalComponent = repo => {
    let component = ModalComponent(repo);

    component.elem.querySelector(".modal_body").classList.add("genes_modal_body");
    component.elem.style.minWidth = "700px";

    component.setTitle(text.genesModal.title);

    let message = document.createElement("p");
    message.textContent = text.genesModal.message;
    component.append(message);

    let button = document.createElement("button");
    button.textContent = text.genesModal.generate;
    button.style.marginTop = "60px";

    let genesAudio = AudioComponent(repo);
    genesAudio.elem.classList.add("smaller");
    genesAudio.disable();

    let textArea = document.createElement("textarea");
    textArea.style.width = "50%";
    textArea.style.maxWidth = "50%";
    textArea.style.height = "400px";
    textArea.setAttribute("placeholder", text.genesModal.putYourJSON);
    textArea.addEventListener("keyup", () => {
        textArea.classList.remove("invalid");
    });

    let container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "flex-start";
    container.style.alignItems = "center";
    container.style.width = "100%";
    container.append(textArea);
    container.append(genesAudio.elem);

    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-start";
    buttonContainer.style.width = "100%";
    buttonContainer.append(button);

    component.append(container);
    component.append(buttonContainer);

    button.addEventListener("click", () => {
        genesAudio.pause();
        let genome = textArea.value;
        try {
            JSON.parse(genome);

            generateFromGenes(genome)
            .then(blob => {
                let url = URL.createObjectURL(blob);
                genesAudio.setSrc(url);
                genesAudio.enable();
            })
            .catch(err => {
                genesAudio.disable();
                textArea.classList.add("invalid");
                console.log(err);
            })
        }
        catch(e){
            genesAudio.disable();
            textArea.classList.add("invalid");
            console.log(e);
        }
    });

    return component;
}

const JSONDisplayComponent = (repo, json = null) => {
    let component = Component(repo, "json_display");

    component.json = json;

    component.setJSON = (json) => {
        component.json = json;
        component.updateDisplay();
    }
    component.updateDisplay = () => {
        component.elem.innerHTML = "";

        if (component.json !== null && component.json !== undefined){
            for (const key of Object.keys(component.json)){
                component.elem.appendChild(component.createElementFromJSON(key, component.json[key]));
            }
        }
    }
    component.createElementFromJSON = (key, json) => {
        let elem = document.createElement("div");
        elem.classList.add("json_display_elem");

        let keySpan = document.createElement("span");
        keySpan.textContent = `${key}: `;
        keySpan.style.color = "#000000A0";

        let valueSpan = document.createElement("span");

        elem.appendChild(keySpan);
        elem.appendChild(valueSpan);

        if (typeof json === "object"){
            if (json === null){
                valueSpan.textContent += "null";
                return elem;
            }
            else {
                for (const jsonKey of Object.keys(json)){
                    elem.appendChild(component.createElementFromJSON(jsonKey, json[jsonKey]));
                }
                return elem;
            }
        }
        else {
            valueSpan.textContent += json;
            return elem;
        }
    }

    component.updateDisplay();
    return component;
}

const EvalBarComponent = (repo, maxMark) => {
    let component = Component(repo, "eval_bar");
    component.maxMark = maxMark;
    component.mark = 0;
    component.clickFunction = () => {};

    for (let i = 0 ; i < component.maxMark ; i++){
        let point = document.createElement("span");
        point.classList.add("material-icons-outlined");
        point.classList.add("eval_bar_point");
        point.setAttribute("data-point", i + 1);
        point.textContent = "stop";
        component.elem.appendChild(point);
    }

    component.setClickFunction = func => {
        component.clickFunction = func;
    }

    component.updatePoints = mark => {
        if (mark <= component.maxMark){
            let points = component.elem.querySelectorAll(".eval_bar_point");
            for (let i = 0 ; i < mark ; i++){
                points[i].classList.remove("material-icons-outlined");
                points[i].classList.add("material-icons");
            }
            for (let i = mark; i < component.maxMark ; i++){
                points[i].classList.remove("material-icons");
                points[i].classList.add("material-icons-outlined");
            }
        }
    }

    component.getMark = () => {
        let points = component.elem.querySelectorAll(".eval_bar_point");
        let mark = 0;
        for (let i = 0 ; i < points.length ; i++){
            if (points[i].classList.contains("material-icons")){
                mark ++;
            }
        }

        return mark;
    }

    component.resetPoints = () => {
        let points = component.elem.querySelectorAll(".eval_bar_point");

        for (let i = 0 ; i < points.length ; i++){
            points[i].classList.remove("material-icons");
            points[i].classList.add("material-icons-outlined");
        }
    }

    component.elem.querySelectorAll(".eval_bar_point").forEach(point => {
        point.addEventListener("mouseover", event => {
            component.updatePoints(event.target.getAttribute("data-point"));
        });
    })

    component.elem.addEventListener("mouseleave", () => {
        component.updatePoints(0);
    });

    component.elem.addEventListener("click", () => {
        let mark = component.getMark();
        if (mark > 0 && mark <= component.maxMark){
            component.clickFunction();
        }
    });

    return component;
}

// Functions

let currentIndividual;

const generateFromGenes = (genome) => {
    return new Promise((resolve, reject) => {
        fetch("/mix/generate_from_genes", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                genome: genome
            })
        })
        .then(res => {
            if (res.ok){
                return res.blob();
            }
            else {
                reject(res.statusText);
            }
        })
        .then(blob => {
            resolve(blob);
        })
        .catch(err => {
            reject(err);
        });
    });
}

const fetchRandomMix = () => {
    return new Promise((resolve, reject) => {
        fetch("/mix/random")
        .then(res => {
            if (res.ok){
                return res.blob();
            }
            else {
                reject(res.statusText);
            }
        })
        .then(blob => {
            resolve(blob);
        })
        .catch(err => {
            reject(err);
        });
    });
}

const getNext = () => {
    return new Promise((resolve, reject) => {
        fetch("/evol/next")
        .then(res => {
            if (res.ok){
                return res.json();
            }
            else {
                reject(res.statusText);
            }
        })
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err);
        });
    });
}

const generate = individual_no => {
    return new Promise((resolve, reject) => {
        fetch(`/mix/generate?individual_no=${individual_no}`)
        .then(res => {
            if (res.ok){
                return res.blob();
            }
            else {
                reject(res.statusText);
            }
        })
        .then(blob => {
            resolve(blob);
        })
        .catch(err => {
            reject(err);
        });
    }); 
}

const evaluate = (individual_no, mark) => {
    return new Promise((resolve, reject) => {
        fetch("/evol/evaluate", {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                individual_no: individual_no,
                mark: mark
            })
        })
        .then(res => {
            if (res.ok){
                return res.text();
            }
            else {
                reject(res.statusText);
            }
        })
        .then(text => {
            resolve(text);
        })
        .catch(err => {
            reject(err);
        });
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

const updateIndividual = (audio, jsonDisplay, evalBar) => {
    getNext()
    .then(data => {
        currentIndividual = data.individual_no;

        let menuInfo = document.querySelector("#left_menu_info");

        let individual_no = parseInt(data.individual_no) + 1;
        menuInfo.querySelector("#gen_no").textContent = data.gen_no;
        menuInfo.querySelector("#individual_no").textContent = individual_no;
        menuInfo.querySelector("#out_of").textContent = data.pop_count;

        delete data.genes.mark;
        jsonDisplay.setJSON(data.genes);

        evalBar.setClickFunction(() => {
            audio.pause();
            evaluate(currentIndividual, evalBar.getMark())
            .then(text => {
                evalBar.resetPoints();
                updateIndividual(audio, jsonDisplay, evalBar);
            })
            .catch(err => {
                console.log(err);
            });
        });

        return generate(currentIndividual);
    })
    .then(blob => {
        let url = URL.createObjectURL(blob);
        audio.setSrc(url);
    })
    .catch(err => {
        console.log(err);
    });
}

// On page load

document.querySelector("#close_left_menu").addEventListener("click", hideLeftMenu);
document.querySelector("#open_left_menu").addEventListener("click", showLeftMenu);

let repo = ComponentRepo("#component_repo");

let resetModal = ResetModalComponent(repo);
resetModal.appendTo(document.body);
document.querySelector("#reset").addEventListener("click", () => {
    resetModal.show();
});

let randomModal = RandomModalComponent(repo);
randomModal.appendTo(document.body);
document.querySelector("#random_loop").addEventListener("click", () => {
    randomModal.show();
});

let genesModal = GenesModalComponent(repo);
genesModal.appendTo(document.body);
document.querySelector("#from_genes").addEventListener("click", () => {
    genesModal.show();
});

let jsonDisplay = JSONDisplayComponent(repo);
jsonDisplay.appendTo(document.querySelector("#left_menu_genome"));

let mainAudio = AudioComponent(repo);
mainAudio.elem.style.marginBottom = "100px";
mainAudio.appendTo(document.querySelector("#content"));

let evalBar = EvalBarComponent(repo, 10);
evalBar.appendTo(document.querySelector("#content"));

resetModal.setFormSubmittedFunction(() => {
    updateIndividual(mainAudio, jsonDisplay, evalBar); 
});

updateIndividual(mainAudio, jsonDisplay, evalBar);

window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector("#loading_mask").classList.remove("show");
        setTimeout(() => {
            document.querySelector("#loading_dna").classList.add("stopped");
        }, 200);
    }, 250);
});
