export type Discussion = {
  id: string;
  name: string;
  type: string;
  poster_path: string;
  imdb_id: string;
  createdAt: Date;
  updatedAt: Date;
  adult: boolean;
  backdrop_path?: string;
  budget?: string;
  homepage?: string;
  origin_country: string[];
  original_title: string;
  original_language: string;
  popularity?: number;
  overview: string;
  threads: any[];
  release_date: string;
  revenue?: string;
  runtime?: string;
  status?: string;
  vote_average: string;
  vote_count: string;
  summary?: string;
  genres: TmdbGenre[];
  production_companies: TmdbCompany[];
};

export type Thread = {
  user: {
    id: string;
    username: string;
    image: string;
  };
  replies: Thread[];
  like_count: number;
  replies_count: number;
  id: string;
  discussion_id: string;
  content: string;
  html: string;
  depth: number;
  isReply: boolean;
  createdAt: Date;
};

export type Blog = {
  id: string;
  title: string;
  content: string;
  html: string;
  tags: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  coverImage: string;
  author: { id: string; username: string; image: string; bio?: string | null };
  views: number;
  _count: {
    likes: number;
    thread: number;
  };
  isDeleted: boolean;
};

export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  private: boolean;
  status: "ALLOWED" | "BANNED";
  bio: string;
  role?: "ADMIN" | "USER" | "TEST";
  image: string;
  profileImage: string;
  joinDate: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  blogsCount: number;
  _count: {
    blogThread: number;
    blogThreadLike: number;
    likes: number;
    threads: number;
    blogLikes: number;
  };
}

export interface DashboardData {
  discussions: {
    count: number;
    last7Days: number;
  };
  blogs: {
    count: number;
    last7Days: number;
  };
  threads: {
    count: number;
    last7Days: number;
  };
  users: {
    count: number;
    last7Days: number;
  };
  lastFive: {
    users: UserProfile[];
    blogs: Blog[];
    threads: Thread[];
  };
}

export type BlogItem = {
  id: string;
  url: string; // /blogs/blog/<slug>
  title: string;
  content: string;
  html: string;
  tags: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  coverImage: string;
  username: string;
  image: string;
  user_id: string;
  views: number;
  likes_count: bigint;
  user_liked: boolean;
};

export interface Like {
  id: string;
  type:
    | "movie-reply"
    | "movie-comment"
    | "blog"
    | "blog-reply"
    | "blog-comment";
  title: string;
  image: string;
  date: string;
  url: string; // discussion URL or blogThread URL
}

export interface Comment {
  id: string;
  type: "movie-reply" | "movie-comment" | "blog-reply" | "blog-comment";
  image: string;
  content: string;
  target: string; // the title/name of the discussion or blog
  date: string;
  likes: number;
  url: string; // discussion or blogThread URL
}

export type Profile = {
  user_profile: UserProfile;
  blogs: {
    total: number;
    data: BlogItem[];
  };
  likes?: {
    total: number;
    data: Like[];
  };
  comments?: {
    total: number;
    data: Comment[];
  };
};

export type BlogsData = {
  data: BlogItem[];
  page: number;
  total_pages: number;
  total_blogs: number;
  topTags: string[];
};
