export type DeviceBody = {
  device_id: string;
  student_id: string;
  name: string;
  password: string;
};

export type LoginBody = {
  device_id: string;
  student_id: string;
  password: string;
}
