import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { GridApi, GridColDef, GridRowId } from "@mui/x-data-grid";

export interface IFilter {
  column: string;
  field: string;
  operator: string;
  values: string;
}
export interface IEvaluations {
  ef: {
    createdAt: Date;
    efName: string;
    keyWords: Array<string>;
    updatedAt: Date;
    _id: string;
  };
  evaluate: string;
}
export interface ILocation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
}
export interface IOppData {
  contacts: Array<IContact>;
  createdAt: Date;
  evaluations: Array<IEvaluations>;
  jobs: Array<IJobs>;
  oppName: string;
  updatedAt: Date;
  author?: {
    userId: string;
    name: string;
  };
  assignedTo?: {
    userId: string;
    name: string;
  };
  _id: string;
}
export interface IFilterData {
  values: string;
  column: string;
  field: string;
  operator: string;
}
export interface IPresetDefault {
  createdAt?: Date;
  filterData: Array<IFilterData>;
  isHidden?: boolean;
  presetName: string;
  updatedAt?: Date;
  _id: string;
}

export interface INestedCompany {
  _id: string;
  name: string;
  website: string;
  contactPhone: string;
}

export interface IJobs {
  _id: string;
  sourceUri: string;
  miningDate: Date;
  remote?: boolean | null;
  remoteRatioInPercent?: number | null;
  locations: string[] | ILocation[];
  oppId: Array<string>;
  minExperienceInYears?: number | null;
  jobId?: string | null;
  title: string;
  employment?: string;
  description?: string | null;
  requirements?: string | null;
  department?: string | null;
  benefits?: string | null;
  updatedAt: Date;
  createdAt: Date;
}
export interface MessageType {
  dequeueCount: number;
  expiresOn: string;
  insertedOn: string;
  messageId: string;
  messageText: string;
}

export interface JobType {
  sourceUri?: string;
  miningDate?: Date;
  minExperienceInYears?: number;
  remote?: boolean;
  remoteRatioInPercent?: number;
  jobLocations?: Array<{
    city?: string;
    state?: string;
    country?: string;
  }>;
  jobId?: string;
  jobTitle?: string;
  jobEmployment?: string;
  jobDescription?: string;
  jobRequirements?: string;
  jobDepartment?: string | Array<string>;
  jobBenefits?: string;
}

export interface UserInfor {
  email: string;
  password: string;
  username?: string;
}
export interface FileLocation {
  containerName: string;
  fileLocation: string;
}
export interface IBotLocation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
}
export interface ICompanyRow {
  _id: string;
  sourceUri: string;
  miningDate: Date;
  companyName: string;
  companyWeb: string;
  contactPhone: string;
  staffCountGlobal: number;
  revenueInEuro: number;
  foundedInYear: number;
  headquarter: IBotLocation;
  branches: IBotLocation[];
  author: {
    userName: string;
    userId: string;
  };
}
export interface IJobRow {
  id: number;
  sourceUri: string;
  /**
   * ISO-8601, UTC,
   * 2024-01-12T08:29:04.131Z
   */
  miningDate: Date;

  minExperienceInYears: number;
  remote: boolean;
  remoteRatioInPercent?: number;

  jobLocations: Array<IBotLocation>;

  jobId?: string;
  // most important skills? (e.g. Azure Enginer), functions? (e.g. sales)
  jobTitle: string;

  /**
   * ETL
   * e.g. Full-Time, Part-Time, Contractor, Internship
   */
  jobEmployment: string;
  jobDescription: string;
  jobRequirements: string;
  /**
   * ETL
   * - derivated from job title
   * - meta data in job description
   * - keywords in description
   *
   * synonym: category
   * e.g. Sale,
   */
  jobDepartment: "Sale" | "Development" | "Design" | "Operations" | "Others";

  /**
   * relevant for Zeroti V2: Headhunters
   */
  jobBenefits: string;
}

export interface IJobData {
  newJob: {
    _id?: string;
    companyName?: string;
    jobListLinkStart?: string;
    jobListLinkNearEnd?: string;
    jobListLinkSelector?: string;
    jobButtonNextSelector?: string;
    jobButtonNextSelectorDisabled?: string;
    jobClickCookie?: string;
    jobDetail?: {
      title?: string;
      id?: string;
      description?: string;
      employment?: string;
      requirements?: string;
      benefits?: string;
      department?: string;
      minExperienceInYears?: string;
      remote?: string;
      locations?: IBotLocation[];
      remoteRatioInPercent?: string;
      textContentJobTitle?: string;
      textContentDescription?: string;
      textContentId?: string;
      textContentEmployment?: string;
      textContentRequirements?: string;
      textContentBenefits?: string;
      textContentDepartment?: string;
      textContentLocationcity?: string;
      textContentLocationcountry?: string;
      textContentMinExperienceInYears?: string;
      textContentRemote?: string;
      textContentRemoteRatioInPercent?: string;
      textContentLocationstate?: string;
    };
    jobList?: Array<string>;
    jobLinkDetail?: string;
  };
}
export interface IScreenProps {
  result: { newJob: IJobData["newJob"] };
  showAdditionalFields: true | false;
}
export interface JobDetails {
  _id?: string;
  companyName?: string;
  jobListLinkStart?: string;
  jobListLinkNearEnd?: string;
  jobListLinkSelector?: string;
  jobButtonNextSelector?: string;
  jobButtonNextSelectorDisabled?: string;
  jobLinkDetail?: string;
  jobClickCookie?: string;
  jobDetail?: {
    title?: string;
    description?: string;
    id?: string;
    employment?: string;
    department?: string;
    requirements?: string;
    benefits?: string;
    locations?: Array<{
      city?: string;
      state?: string;
      country?: string;
    }>;
    minExperienceInYears?: string;
    remote?: string;
    remoteRatioInPercent?: string;
  };
}
export interface IPresetFilter {
  label: string;
  keyword: string;
}

export interface TrainingData {
  newTraining: {
    _id?: string;
    companyName?: string;
    trainingListLinkStart?: string;
    trainingListLinkNearEnd?: string;
    trainingListLinkSelector?: string;
    trainingButtonNextSelector?: string;
    trainingButtonNextSelectorDisabled?: string;
    trainingClickCookie?: string;
    trainingDetail?: {
      trainingTitle?: string;
      trainingCode?: string;
      trainingCodeVendor?: string;
      trainingDurationInDays?: string;
      trainingNettoInEuro?: string;
      trainingLocation?: string;
      trainingStart?: string;
      trainingEnd?: string;
      trainingContent?: string;
      trainingOverview?: string;
      trainingRequirements?: string;
      trainingTargetGroup?: string;
      trainingLearningGoal?: string;
      trainingGuaranteed?: string;
      trainingLanguage?: string;
      textContentTrainingTitle?: string;
      textContentTrainingCode?: string;
      textContentTrainingCodeVendor?: string;
      textContentTrainingDurationInDays?: string;
      textContentTrainingNettoInEuro?: string;
      textContentTrainingLocation?: string;
      textContentTrainingStart?: string;
      textContentTrainingEnd?: string;
      textContentTrainingOverview?: string;
      textContentTrainingRequirements?: string;
      textContentTrainingTargetGroup?: string;
      textContentTrainingContent?: string;
      textContentTrainingLearningGoal?: string;
      textContentTrainingGuaranteed?: string;
      textContentTrainingLanguage?: string;
    };
    trainingList?: Array<string>;
    trainingLinkDetail?: string;
  };
}
export interface IscreenProps {
  result: { newTraining: TrainingData["newTraining"] };
  showAdditionalFields: true | false;
}
export interface ITraining {
  trainingTitle?: string;
  trainingCode?: string;
  trainingCodeVendor?: string;
  trainingDurationInDays?: string;
  trainingNettoInEuro?: string;
  trainingLocation?: string;
  trainingStart?: string;
  trainingEnd?: string;
  trainingContent?: string;
  trainingOverview?: string;
  trainingRequirements?: string;
  trainingTargetGroup?: string;
  trainingLearningGoal?: string;
  trainingGuaranteed?: string;
  trainingLanguage?: string;
}
export interface TrainingDetails {
  companyName?: string;
  trainingClickCookie?: string;
  trainingListLinkStart?: string;
  trainingListLinkNearEnd?: string;
  trainingListLinkSelector?: string;
  trainingButtonNextSelector?: string;
  trainingButtonNextSelectorDisabled?: string;
  trainingLinkDetail?: string;
  trainingDetail?: ITraining;
}
export interface IAuthorModify {
  userName?: string;
  updateDate: Date;
}
export interface IOpp {
  oppName?: string;
  jobs?: object[];
  contactId?: string;
  authorContact?: string;
  authorModify?: IAuthorModify;
}
export interface INote {
  description?: string;
}
export interface IContact {
  companyName?: string;
  positionInCompany?: string;
  email?: string;
  state: string;
  phone?: string;
  notes: INote;
  contactDates?: Date;
  tags?: string;
  _id?: string;
  author?: Array<string>;
  inOpp?: Array<IOppName>;
  socialLinkedin?: string;
  linkedinProfile?: string;
  socialXing?: string;
  avatarLinkedin?: string;
  avatarXing?: string;
  authorModify?: IAuthorModify;
}
export interface IState {
  stateName: string;
  color: string;
}

// sent contact
export interface IContactSent {
  _id?: string[];
  content?: string;
}
export interface CompanyLocation {
  city?: string;
  state?: string;
  country?: string;
}
export interface CompanyData {
  newCompany: {
    _id?: string;
    companySourceOrg?: string;
    companyListLinkStart?: string;
    companyListLinkNearEnd?: string;
    companyListLinkSelector?: string;
    companyButtonNextSelector?: string;
    companyButtonNextSelectorDisabled?: string;
    companyClickCookie?: string;
    companyList?: Array<string>;
    companyLinkDetail?: string;
    companyDetail?: {
      companyName?: string;
      companyWeb?: string;
      contactPhone?: string;
      staffCountInDE?: string;
      staffCountGlobal?: string;
      revenueInEuro?: string;
      foundedInYear?: string;
      headquarter?: CompanyLocation;
      branches?: CompanyLocation[];
      businessArea?: string;
      textContentCompanyName?: string;
      textContentCompanyWeb?: string;
      textContentContactPhone?: string;
      textContentStaffCountInDE?: string;
      textContentStaffCountGlobal?: string;
      textContentRevenueInEuro?: string;
      textContentFoundedInYear?: string;
      textContentHeadquartercity?: string;
      textContentHeadquarterstate?: string;
      textContentHeadquartercountry?: string;
      textContentBranchescity?: string;
      textContentBranchesstate?: string;
      textContentBranchescountry?: string;
      textContentBusinessArea?: string;
    };
  };
}

export interface companyDetails {
  companySourceOrg?: string;
  companyListLinkStart?: string;
  companyListLinkNearEnd?: string;
  companyListLinkSelector?: string;
  companyButtonNextSelector?: string;
  companyButtonNextSelectorDisabled?: string;
  companyLinkDetail?: string;
  companyClickCookie?: string;
  companyDetail?: {
    companyName?: string;
    contactPhone?: string;
    companyWeb?: string;
    staffCountInDE?: string;
    foundedInYear?: string;
    staffCountGlobal?: string;
    revenueInEuro?: string;
    businessArea?: string;
    headquarter?: {
      city?: string;
      state?: string;
      country?: string;
    };
    branches?:
      | [
          {
            city?: string;
            state?: string;
            country?: string;
          }
        ]
      | [];
  };
}
export interface IOppName {
  oppName?: string;
  oppId?: string;
}
export interface IPaginateJob {
  docs?: Array<IJobs>;
  totalDocs?: number;
  offset?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: boolean | null;
  nextPage?: boolean | null;
}

export interface IPaginateContact {
  data?: Array<IContact>;
  totalDocs?: number;
  offset?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: boolean | null;
  nextPage?: boolean | null;
}
interface IBody {
  contentType?: string;
  content?: string;
}
export interface IEmail {
  name?: string;
  address?: string;
}
export interface IEmailAddress {
  emailAddress: IEmail;
}
interface IDateZone {
  dateTime?: Date;
  timeZone?: string;
}
interface ILocationMail {
  displayName: string;
  locationType: string;
  uniqueIdType: string;
}
export interface IMail {
  id?: string;
  _id: string;
  createdDateTime?: Date;
  lastModifiedDateTime?: Date;
  changeKey?: string;
  receivedDateTime: Date;
  sentDateTime?: Date;
  hasAttachments?: boolean;
  internetMessageId?: string;
  subject?: string | null;
  bodyPreview: string;
  importance?: string;
  parentFolderId?: string;
  conversationId?: string;
  conversationIndex?: string;
  isDeliveryReceiptRequested?: boolean;
  isReadReceiptRequested?: boolean;
  isRead?: boolean;
  isDraft?: boolean;
  allowNewTimeProposals?: string | null;
  meetingRequestType?: string;
  body?: IBody;
  sender?: IEmailAddress;
  from: IEmailAddress;
  toRecipients?: Array<IEmailAddress>;
  ccRecipients?: Array<IEmailAddress>;
  replyTo?: Array<IEmailAddress>;
  inferenceClassification?: string;
  responseRequested?: string;
  type?: string;
  meetingMessageType?: string;
  location?: ILocationMail;
  startDateTime?: IDateZone;
  endDateTime?: IDateZone;
  flag: { flagStatus: string | boolean | number };
}

interface IData {
  jobsAdded: number;
  jobsModified?: number;
  companiesAdded: number;
  companiesModified?: number;
  oppsAdded: number;
  oppsModified?: number;
  contactsAdded: number;
  contactsModified?: number;
  jobAddToOpp?: number;
}
export interface IAnalysis {
  inMonth: IData;
  total: IData;
  bySale: IData & { author: string };
  updatedAt: string;
  createdAt: string;
}

export interface GridValueGetterParams {
  id: GridRowId;
  row: any;
  field: string;
  value: any;
  getValue: (field: string) => any;
  colDef: GridColDef;
  api: GridApi;
}

export const jobContainerName = "job";
export const jobLogsContainerName = "job-logs";
export const trainingContainerName = "training";
export const trainingLogsContainerName = "training-logs";
export const companyContainerName = "company";
export const companyLogsContainerName = "company-logs";
export const dateRegexOneYear1st = /^(\d{4})-(\d{2})-(\d{2})$/; // 2023-12-21
export const dateRegexTwoYear2nd = /^(\d{4})\/(\d{2})\/(\d{2})$/; // 2023/12/21
export const dateRegexOneDay1st = /^(\d{2})\/(\d{1,2})\/(\d{4})$/; // 21-12-2023
export const dateRegexOneDay2nd = /^(\d{2})\/(\d{1,2})\/(\d{4})$/; // 21/12/2023

export const accessToken = localStorage.getItem("accessToken") ?? "";
export const configFetch = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
  },
};
export const apiOrigin: string = (process.env.REACT_APP_API_ORIGIN as string) || "http://localhost:3000/svc/v1";
//"https://zmiapi.azurewebsites.net/api"
//"http://localhost:3000/api"
//"http://172.16.36.119:3000/api"

export const axiosInstance =  axios.create({
    baseURL: apiOrigin,
    headers: {
      "Content-Type": "application/json",
    },
  });


export const handleAxiosError = (error: unknown, context: string) => {
  const axiosError = error as AxiosError;

  if (axiosError.response) {
    switch (axiosError.response.status) {
      case 401:
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        break;
      case 500:
        toast.error("The server is currently under heavy load. Please try again later.");
        break;
      default:
        toast.error(`${context}: ${axiosError.message}`);
        break;
    }
  } else {
    toast.error(`${context}: ${axiosError.message}`);
  }
};


export function createData(
  keyword: string,
  total: number,
  market: number,
  industry: number,
  companies: any[]
) {
  return {
    keyword,
    market,
    total,
    industry,
    companies
  };
}




