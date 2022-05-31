export function generateIntCode() {
  return Math.floor(Math.random() * 900000 + 100000);
}

export function isNationalCode(code: string) {
  let controller = 0;

  let sum = 0;
  let j = 10;
  for (let i = 0; i < code.length - 1; i++) {
    sum += Number(code[i]) * j;
    j--;
  }

  const r1 = sum % 11;
  r1 < 2 ? (controller = 1) : (controller = 11 - r1);
  return parseInt(code[9]) == controller;
}

export function getIntervalTime(time: Date, minute: number) {
  return new Date(time.getTime() + minute * 60000);
}
