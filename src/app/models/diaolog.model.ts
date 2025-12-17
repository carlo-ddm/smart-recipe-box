export interface ConfirmationDialog {
  title: string;
  message: string;
  action: (confirmed: boolean) => void;
}
