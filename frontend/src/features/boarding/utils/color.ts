  const getUserTypeColor = (userType: string): 'primary' | 'secondary' | 'success' | 'default' => {
    switch (userType) {
      case 'student':
        return 'primary';
      case 'teacher':
        return 'secondary';
      case 'staff':
        return 'success';
      default:
        return 'default';
    }
  };