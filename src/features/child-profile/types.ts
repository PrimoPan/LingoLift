export type ReinforcementImage = {
  uri?: string;
  remote?: string;
};

export type ReinforcementItem = {
  id: string | number;
  value: string;
  image?: ReinforcementImage;
};

export type ChildProfileData = {
  name?: string;
  gender?: string;
  age?: number | string;
  courseDuration?: number | string;
  childImage?: string;
  imageStyle?: string;
  reinforcements?: ReinforcementItem[];
  selectedInitials?: string[];
  命名?: number;
  对话?: number;
  语言结构?: number;
  [key: string]: unknown;
};
