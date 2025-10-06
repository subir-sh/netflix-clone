export interface Title {
  id: number;
  title: string;
  genre: string;
  image: string;
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

export interface DataResponse {
  modalContent: Record<string, string>;
  categoryContent: Record<string, { genre: string; visible: number }>;
  titleGroups: Record<string, Title[]>;
}