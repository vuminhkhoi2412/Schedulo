export interface HeaderComponentProps {
  setDayIndex: React.Dispatch<React.SetStateAction<number>>;
  dayIndex: number;
}

export interface TaskAdditionComponentProps {
  title: string;
  subInput: React.ReactNode;
  children: React.ReactNode; // Add children to the props interface
}

export type RootStackParamList = {
  PromoSegment: {segmentIndex: number};
};

export interface FileDataProps {
  fileCopyUri: string | null;
  name: string;
  size: number;
  type: string;
  uri: string;
  check: boolean;
  date: string;
}

export interface HomeTaskBtnProps {
  tabIndex: number;
  handleNavigate: () => void;
}

export interface TaskAdditionProps {
  title: string;
  note: string;
  date: Date;
  time: string; // format HH:mm - HH:mm
  reminder: string;
  repeat: string[];
  group: string;
}

export interface SubTaskInputProps {
  taskData: TaskAdditionProps;
  setTaskData: React.Dispatch<React.SetStateAction<TaskAdditionProps>>;
}

export interface ChallengeItem {
  title: string;
  aim: string;
  date: Date;
  reminder: string;
}

export interface challengeInputProps {
  challengeData: ChallengeItem;
  setChallengeData: React.Dispatch<React.SetStateAction<ChallengeItem>>;
}

export interface RenderTaskViewProps {
  isToday: boolean;
  taskData: TaskAdditionProps[][];
  tabDateIndex: number;
}

export interface ChallengeComponentProps {
  weekDayIndex: number;
  todayIndex: number;
  tabCurrentIndex: number;
  selectedDay: string;
  handleNavigate: () => void;
  challengeData: ChallengeItem[][];
}

export interface TaskItem {
  title: string;
  note: string;
  date: Date;
  time: string; // format HH:mm - HH:mm
  reminder: string;
  repeat: string[];
  group: string;
}

export interface SchedulePageProps {
  todayIndex: number;
  weekDayIndex: number;
  selectedDay: string;
}

export interface ScheduleDataProps {
  from: string;
  to: string;
  title: string;
  note: string;
  ischecked: boolean;
}
