import { fetchImages } from './fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

let page = null;
let per_page = 40;
let totalPage = 0;
let valueInput = '';

function onFormSubmit(e) {
  e.preventDefault();

  galleryEl.innerHTML = '';
  page = 1;

  valueInput = e.target.elements.searchQuery.value;

  if (!valueInput) return;

  requestImages(valueInput, page);
}

function onClickLoadMore() {
  page += 1;

  requestImages(valueInput, page);
}

async function requestImages(valueInput, page) {
  try {
    const res = await fetchImages(valueInput, page);
    const {
      data: { totalHits, hits },
    } = res;

    createMarkup(hits);

    totalPage = Math.ceil(totalHits / per_page);

    if (!totalHits) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (page !== totalPage) {
      const infiniteObserver = new IntersectionObserver(
        ([entry], observer) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            onClickLoadMore();
          }
        },
        {
          threshold: 0.5,
        }
      );

      const lastCard = document.querySelector('.photo-card:last-child');
      if (lastCard) {
        return infiniteObserver.observe(lastCard);
      }
    }

    if (page === totalPage) {
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function createMarkup(data) {
  const markup = data.reduce(
    (
      acc,
      { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) =>
      acc +
      ` <div class="photo-card">
         <img
    class="gallery__image"
    src="${webformatURL}"
    data-source="${largeImageURL}"                      
    alt="${tags}" loading="lazy" width="300"/>
          <div class="info">
        <p class="info-item">
          <b>Likes: </b>${likes}
        </p>
        <p class="info-item">
          <b>Views: </b>${views}
        </p>
        <p class="info-item">
          <b>Comments: </b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads: </b>${downloads}
        </p>
      </div>
    </div> `,
    ''
  );
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

form.addEventListener('submit', onFormSubmit);
// btnLoadMore.addEventListener('click', onClickLoadMore);
