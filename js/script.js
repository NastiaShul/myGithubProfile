"use strict";

function boot() {

	const profileContainer = document.querySelector(".js-profile-container"),
		loadRepos = document.querySelector(".js-load-repos-btn"),
		reposTittle = document.querySelector(".js-repos-tittle"),
		reposRow = document.querySelector(".js-repos-row"),
		loadStatus = reposRow.querySelector(".js-spinner");

	async function getResource(url) {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}
		return await res.json();
	}


	function renderProfile(data) {
		profileContainer.innerHTML = `
		<a href="https://github.com/${data.login}" class="my-profile__name">${data.name}</a>
		<h4 class="my-profile__nickname">${data.login}</h4>
		<h5 class="my-profile__role">${data.bio}</h5>
		<div class="my-profile__contacts contacts">
			<div class="contacts__email">
				<img src="./img/email.svg" alt="email">
				<a href="maito:${data.email}">${data.email}</a>
			</div>
			<div class="contacts__social">
				<img src="./img/link.svg" alt="link">
				<a href="https://www.l${data.blog}"
					target="_blank">${data.blog}</a>
			</div >
		</div >
		`;
	}

	function renderRepos(data) {
		console.log(data);
		const dataForRepo = data.reduce((repos, item) => {
			return repos += `
				<div class="repos__item repo">
					<a href="${item.clone_url}" class="repo__name">${item.name}</a>
					<p>
						<span class="repo__update">Last updated:</span>
						<span class="repo__date">${new Date(item.updated_at).toLocaleDateString('en-EN', { day: 'numeric', month: 'long', year: 'numeric' }).replace(" y.", "")}</span>
					</p>
				</div>
			`;
		}, "")
		reposRow.insertAdjacentHTML('afterbegin', dataForRepo);
	}


	getResource("https://api.github.com/users/nastyashul")
		.then(data => renderProfile(data));


	loadRepos.addEventListener("click", () => {
		loadStatus.classList.remove("hide");
		getResource("https://api.github.com/users/nastyashul/repos")
			.then(data => {
				return renderRepos(data);
			})
			.then(() => {
				reposTittle.classList.remove("hide");
				loadRepos.classList.add("hide");
				loadStatus.classList.add("hide");
			})
	});

}

document.addEventListener("DOMContentLoaded", boot);
