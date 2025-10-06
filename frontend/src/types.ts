export interface ModalContent {
  [key: string]: string;
}

export interface Item {
  id: string;
  title: string;
  img: string;
  alt: string;
}

export interface Category {
  genre: string;
  visible: number;
  items: Item[];
}

export interface RawCategory {
  genre: string;
  visible: number;
  count: number;
}

export interface DataResponse {
  modalContent: ModalContent;
  categoryContent: { [key: string]: RawCategory };
}