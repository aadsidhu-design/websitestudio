export interface StoryboardFrame {
  imageUrl: string;
  description: string;
}

export interface StoryboardOption {
  frames: StoryboardFrame[];
}

export interface AnimationFrame {
  id: string;
  url: string;
}
