"use strict";
const nameOfUser = document.querySelector('#name');
const surnameOfUser = document.querySelector('#surname');
const btnEdit = document.querySelector('.btn-edit');
const btnFollowUser = document.querySelector('#btn-follow-user');
const btnDelete = document.querySelector('#btn-delete');
const form = document.querySelector('#form');
const formTwo = document.querySelector('#form-2');
const formSubscribe = document.querySelector('#form-subscribe');
const baseUrl = 'http://146.185.154.90:8000/blog/saikalabytova1@gmail.com/';
const inputUserName = document.querySelector('#inputName');
const inputUserSurname = document.querySelector('#inputSurname');
const inputText = document.querySelector('#inputText');
const inputEmail = document.querySelector('#inputEmail');
const messageBox = document.querySelector('#message-box');
const modal = new bootstrap.Modal(document.getElementById('modal'));
const modalTwo = new bootstrap.Modal(document.getElementById('modal-2'));
let nameUser = '';
let surname = '';
let date = '';
const getResponce = async () => {
    const responceGet = await fetch(baseUrl + 'profile');
    const responceGetJSON = await responceGet.json();
    nameUser = responceGetJSON.firstName;
    surname = responceGetJSON.lastName;
    nameOfUser.innerHTML = responceGetJSON.firstName;
    surnameOfUser.innerHTML = responceGetJSON.lastName;
};
try {
    getResponce();
}
catch (error) {
    alert(`Oops ${error}`);
}
const postResponce = async (url, data) => {
    const responcePost = await fetch(url, data);
    const responcePostJSON = await responcePost.json();
    console.log(responcePostJSON);
};
const printMessages = (responce) => {
    responce.forEach((obj) => {
        const div = document.createElement('div');
        div.innerHTML = `<div>Name: <span>${obj.user.firstName} </span><span> ${obj.user.lastName}
        </span></div><div>Message: ${obj.message}</div>`;
        div.style.borderBottom = '0.5px solid white';
        div.style.marginBottom = '15px';
        div.style.fontSize = '18px';
        messageBox.appendChild(div);
    });
};
const getPosts = async () => {
    const responceGetPosts = await fetch(baseUrl + 'posts');
    const responceGetPostsJSON = await responceGetPosts.json();
    const lastMessage = responceGetPostsJSON[responceGetPostsJSON.length - 1];
    date = lastMessage.datetime;
    printMessages(responceGetPostsJSON);
};
try {
    getPosts();
}
catch (error) {
    alert(`Oops ${error}`);
}
btnEdit.addEventListener('click', () => {
    modal.show();
});
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = new URLSearchParams();
    body.append('firstName', inputUserName.value);
    body.append('lastName', inputUserSurname.value);
    try {
        await postResponce(baseUrl + 'profile', { method: 'POST', body });
    }
    catch (error) {
        alert(`Oops ${error}`);
    }
    nameUser = inputUserName.value;
    surname = inputUserSurname.value;
    nameOfUser.innerHTML = nameUser;
    surnameOfUser.innerHTML = surname;
});
setInterval(async () => {
    try {
        const responceDate = await fetch(baseUrl + 'posts?datetime=' + date);
        const responceDateJSON = await responceDate.json();
        if (responceDateJSON.length !== 0) {
            const lastMessage = responceDateJSON[responceDateJSON.length - 1];
            date = lastMessage.datetime;
            printMessages(responceDateJSON);
        }
    }
    catch (error) {
        alert(`Oops ${error}`);
    }
}, 3000);
formTwo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = new URLSearchParams();
    body.append('message', inputText.value);
    try {
        await postResponce(baseUrl + 'posts', { method: 'POST', body });
    }
    catch (error) {
        alert(`Oops ${error}`);
    }
});
btnFollowUser.addEventListener('click', () => {
    modalTwo.show();
});
formSubscribe.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = new URLSearchParams();
    body.append('email', inputEmail.value);
    console.log(inputEmail.value);
    try {
        await postResponce(baseUrl + 'subscribe', { method: 'POST', body });
    }
    catch (error) {
        alert(`Oops ${error}`);
    }
});
btnDelete.addEventListener('click', async () => {
    await postResponce(baseUrl + 'subscribe/delete', { method: 'POST' });
});
