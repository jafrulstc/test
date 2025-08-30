import { Status } from "~/shared/types/common";

export  const getStatusColor = (status: Status): 'success' | 'warning' | 'default' => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'warning';
            case 'PENDING':
        return 'warning';
            case 'ARCHIVE':
        return 'warning';
      default:
        return 'default';
    }
  };