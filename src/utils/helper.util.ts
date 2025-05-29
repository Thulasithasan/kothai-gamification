function generateOtp() {
  return Math.floor(Math.random() * 9000 + 1000);
}
function addHours(h: number): Date {
  const date = new Date();
  date.setTime(date.getTime() + h * 60 * 60 * 1000);
  return date;
}

function pageSkip(skip: number, limit: number) {
  return skip == 0 ? 0 : skip * limit;
}

const HelperUtil = {
  generateOtp,
  addHours,
  pageSkip,
};
export default HelperUtil;
