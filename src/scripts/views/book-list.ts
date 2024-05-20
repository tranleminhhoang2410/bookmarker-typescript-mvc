// Constants
import { PAGINATION } from '@/constants';

// Types
import {
  AddBookHandler,
  Book,
  DisplayFormHandler,
  EditBookHandler,
  GetImageUrlHandler,
  PageChangeHandler,
} from '@/types';

// Utils
import {
  createBookFormModal,
  createBookFormTitle,
  createElement,
  getElement,
  getElements,
  handleFileInputChange,
  handleFormSubmit,
  handleInputValidation,
  handleNegativeButtonClick,
  removeDOMElement,
  removeDOMElementBySelector,
  updateDOMElement,
} from '@/utils';

// Templates
import { generateBookItem, generateListEmpty, generatePagination, generateSkeletonBookItem } from '@/templates';

// Icons
import viewDetailsIcon from '../../assets/icons/right-forward.svg';
import deleteIcon from '../../assets/icons/trash.svg';

// Constants
import { BOOK_FORM } from '@/constants';

// Mocks
import { MOCK_BOOK } from '@/mocks';

export default class BookListView {
  private mainContent: HTMLDivElement;
  private bookListWrapper: HTMLDivElement;
  private bookList: HTMLUListElement;
  private createBtn: HTMLButtonElement;
  private searchBox: HTMLInputElement;
  private sortBtns: NodeListOf<HTMLButtonElement>;
  private sortStatus: string;

  constructor() {
    this.mainContent = getElement('.content');
    this.bookListWrapper = getElement('.book-list-wrapper');
    this.bookList = getElement('.book-list');
    this.createBtn = getElement<HTMLButtonElement>('#btn-create');
    this.searchBox = getElement('#search-box');
    this.sortBtns = getElements('.btn-sort');
    this.sortStatus = '';
  }

  displaySkeletonBooks = (count: number) => {
    Array.from({ length: count }).forEach(() => {
      const skeletonBookItem = createElement('li', 'skeleton-book-item');
      skeletonBookItem.innerHTML = generateSkeletonBookItem();
      updateDOMElement(this.bookList, skeletonBookItem);
    });
  };

  displayBooks = (bookList: Book[], booksShow: Book[], currentPage: number) => {
    while (this.bookList.firstChild) {
      this.bookList.removeChild(this.bookList.firstChild);
    }

    // Remove existing Pagination
    removeDOMElementBySelector(this.bookListWrapper, '.pagination');

    // Remove existing Empty list
    removeDOMElementBySelector(this.bookListWrapper, '.list-empty');

    if (booksShow.length === 0) {
      const bookListEmpty = createElement('div', 'list-empty');
      bookListEmpty.innerHTML = generateListEmpty();
      this.bookListWrapper.appendChild(bookListEmpty);
      removeDOMElement(this.bookListWrapper, this.bookList);
    } else {
      booksShow.forEach((book) => {
        const bookItem = createElement('li', 'book-item');
        const icons = { viewDetailsIcon, deleteIcon };
        bookItem.innerHTML = generateBookItem(book, icons);
        bookItem.setAttribute('data-book-id', book.id.toString());
        updateDOMElement(this.bookList, bookItem);
        updateDOMElement(this.bookListWrapper, this.bookList);
      });

      // Display Pagination
      if (bookList.length > PAGINATION.ITEMS_PER_PAGE) {
        const paginationContainer = createElement('div', 'pagination');
        const paginationElement = generatePagination(
          bookList.length,
          PAGINATION.ITEMS_PER_PAGE,
          () => {
            removeDOMElement(this.bookListWrapper, paginationContainer);
          },
          currentPage,
        );

        if (paginationElement) {
          updateDOMElement(paginationContainer, paginationElement);
          updateDOMElement(this.bookListWrapper, paginationContainer);
        }
      }
    }
  };

  bindPageChange(handler: PageChangeHandler) {
    this.mainContent.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('btn-pagination')) {
        const pageNumber = parseInt(target.dataset.page!, 10);
        if (pageNumber) {
          handler(pageNumber);
        }
      }
    });
  }

  bindAddBook = (getImageUrlHandler: GetImageUrlHandler, addHandler: AddBookHandler) => {
    this.createBtn.addEventListener('click', (event) => {
      event.preventDefault();

      this.showBookForm(MOCK_BOOK, false, getImageUrlHandler, async (data: Omit<Book, 'id'>) => {
        addHandler(data);
      });
    });
  };

  bindEditBook = (
    displayFormHandler: DisplayFormHandler,
    getImageUrlHandler: GetImageUrlHandler,
    editHandler: EditBookHandler,
  ) => {
    this.mainContent.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;

      const bookItem = target.closest('.book-item');

      const btnDelete = target.closest('.btn-delete');

      if (btnDelete) {
        return;
      }

      if (bookItem) {
        const bookIdString = bookItem.getAttribute('data-book-id');

        if (bookIdString === null) return;

        const bookId = parseInt(bookIdString);

        const selectedBook = await displayFormHandler(bookId);

        this.showBookForm(selectedBook, true, getImageUrlHandler, async (data: Omit<Book, 'id'>) => {
          editHandler(bookId, data);
        });
      }
    });
  };

  showBookForm = (
    book: Book,
    isEdit: boolean,
    getImageUrlHandler: GetImageUrlHandler,
    saveCallback: (input: Omit<Book, 'id'>) => void,
  ) => {
    const formTitle = createBookFormTitle(book, isEdit);
    const bookFormModal = createBookFormModal(book, formTitle);

    this.mainContent.appendChild(bookFormModal);

    const form = getElement<HTMLFormElement>('#book-form');
    const inputElements = getElements<HTMLInputElement>('.input-box');
    const fileInput = getElement<HTMLInputElement>(`#${BOOK_FORM.FILE_INPUT_ID}`);
    const bookImgPreview = getElement<HTMLImageElement>('.book-img-preview');
    const bookNamePreview = getElement('.book-name-preview');
    const uploadBtn = getElement<HTMLButtonElement>('#btn-upload');
    const positiveButton = getElement<HTMLButtonElement>(`#${BOOK_FORM.POSITIVE_BUTTON_ID}`);
    const negativeButton = getElement<HTMLButtonElement>(`#${BOOK_FORM.NEGATIVE_BUTTON_ID}`);

    let imageUrl = book.imageUrl || '';

    const setImageUrl = (url: string) => {
      imageUrl = url;
    };

    const getImageUrl = () => {
      return imageUrl;
    };

    handleFileInputChange(
      fileInput,
      bookNamePreview,
      bookImgPreview,
      uploadBtn,
      positiveButton,
      getImageUrlHandler,
      setImageUrl,
    );
    handleInputValidation(inputElements);
    handleNegativeButtonClick(negativeButton, bookFormModal);
    handleFormSubmit(form, inputElements, getImageUrl, isEdit, saveCallback, bookFormModal, this.mainContent);
  };
}
