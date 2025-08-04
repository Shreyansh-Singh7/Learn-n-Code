export interface IArticle {
    article_id: number;
    title: string;
    description: string;
    url: string;
    image_url: string;
    source: string;
    language: string;
    published_at: string;
    likes: number;
    dislikes: number;
    keywords?: String[];
}

export interface IExternalServer {
    serverId: number;
    name: string;
    apiKey: string;
    status: string;
    lastAccessed: string;
  }
  
export interface ICategory {
    category_id: number;
    category_name: string;
}

export interface INotificationSetting {
    id: number;
    user_id: number;
    category_id: number;
    enabled: boolean;
    keywords: string[];
}

export interface INotification {
    id: number;
    user_id: number;
    article_id: number;
    sent_at: string;
    delivered_via: 'email' | 'app';
}

export interface IAdminNotification {
    notification_id: number;
    article_id: number;
    reason: string;
    read: boolean;
    created_at: string;
}

export interface IUserReport {
    report_id: number;
    user_id: number;
    article_id: number;
    reason: string;
    created_at: string;
}

export interface IBlockedKeyword {
    keyword_id: number;
    keyword: string;
    created_at: string;
}
