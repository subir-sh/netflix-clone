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
  title: string;
  visible: number;
  items: Item[];
}

export interface RawCategory {
  title: string;
  visible: number;
  count: number;
}

export interface DataResponse {
  modalContent: ModalContent;
  categoryContent: { [key: string]: RawCategory };
}