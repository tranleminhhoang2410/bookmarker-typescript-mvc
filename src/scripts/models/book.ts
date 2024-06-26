// Types
import { Book } from '@/types';

//Services
import {
  addBookService,
  deleteBookService,
  editBookService,
  getBookByIdService,
  getBooksServices,
  getImageUrlServices,
  getRecommendBookServices,
} from '@/services';

export default class BookModel {
  addBook = async (bookData: Omit<Book, 'id'>) => {
    const response = await addBookService(bookData);
    return response;
  };

  getBooks = async () => {
    const response = await getBooksServices();
    return response;
  };

  getBookById = async (bookId: number) => {
    const response = await getBookByIdService(bookId);
    return response;
  };

  editBook = async (bookId: number, bookData: Omit<Book, 'id'>) => {
    await editBookService(bookId, bookData);
  };

  deleteBook = async (bookId: number) => {
    await deleteBookService(bookId);
  };

  getImageUrl = async (fileUpload: FormData) => {
    const response = await getImageUrlServices(fileUpload);
    return response;
  };

  getRecommendBooks = async (query: string) => {
    const response = await getRecommendBookServices(query);
    return response;
  };
}
