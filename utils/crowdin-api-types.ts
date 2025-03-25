export interface ProjectListResponse {
  data: ProjectData[];
}

export interface ProjectData {
  data: {
    id: number;
    identifier: string;
  };
}

export interface ProjectTranslationProgressResponse {
  data: Array<{
    data: {
      translationProgress: number;
      approvalProgress: number;
      languageId: string;
      language: CrowdinLanguage;
    };
  }>;
  pagination: {
    offset: number;
    limit: number;
  };
}

export interface ProjectReportResponse {
  data: {
    identifier: string;
    status: string;
    /** in percentages */
    progress: number;
    /** <date-time> */
    createdAt: string;
    /** <date-time> */
    updatedAt: string;
    /** <date-time> */
    startedAt: string;
    /** <date-time> */
    finishedAt: string;
  };
}

export interface ProjectReportDownloadResponse {
  data: {
    url: string;
    expireIn: string;
  };
}

export interface CrowdinLanguage {
  id: string;
  name: string;
}

export interface ProjectReportDataResponse {
  name: string;
  url: string;
  unit: string;
  dateRange: {
    from: string;
    to: string;
  };
  language: string;
  data: Array<{
    user: {
      id: string;
      username: string;
      fullName: string;
      avatarUrl: string;
      joined: string;
    };
    languages: Array<CrowdinLanguage>;
    translated: number;
    approved: number;
    voted: number;
    positiveVotes: number;
    negativeVotes: number;
    winning: number;
  }>;
}
