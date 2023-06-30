import { getImage } from "./pixabayApi";
import refs from './refs'
import createGalleryCards from '../templates/gallery-markup.hbs'
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


let searchQuery = ''
let page = 1
let perPage = 40
const lightbox = new SimpleLightbox('.gallery a', {});


refs.searchForm.addEventListener('submit', onSearchSubmit)
refs.loadMoreButton.addEventListener('click', onMoreBtnClick)

async function onMoreBtnClick(e) {
    page += 1



    try {
        const response = await getImage(page, searchQuery, perPage)

        const currentPage = Math.ceil(response.totalHits / perPage)

        const markup = createGalleryCards(response.hits)
        refs.galleryContainer.insertAdjacentHTML('beforeend', markup)
        lightbox.refresh()


        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });

        if (currentPage === page) {
            Notiflix.Notify.warning("Cool, you've reached the end of search results.");
            refs.loadMoreButton.classList.add('is-hidden')
        }


    } catch (err) { console.log }
}

async function onSearchSubmit(e) {
    e.preventDefault()
    page = 1
    searchQuery = e.currentTarget.searchQuery.value.trim()


    if (!searchQuery) {

        return Notiflix.Notify.warning("Input valid values");
    }
    try {
        const response = await getImage(page, searchQuery,perPage)

        if (response.hits.length === 0) {
            refs.galleryContainer.innerHTML = ''
            refs.loadMoreButton.classList.add('is-hidden')
            return Notiflix.Notify.warning(`Sorry, there are no images matching your ${searchQuery}. Please try again.`);
        }


        const markup = createGalleryCards(response.hits)
        refs.galleryContainer.innerHTML = markup
        lightbox.refresh()


        Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`)

        if (response.totalHits < 40) {
            return
        }

        refs.loadMoreButton.classList.remove('is-hidden')
    } catch (err) {
        console.warn(err);
    }

}