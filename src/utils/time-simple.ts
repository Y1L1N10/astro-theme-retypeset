/**
 * 简化版时间工具 - 用于热力图
 * 不依赖 luxon，使用原生 Date API
 */

/**
 * 格式化日期为本地化字符串
 */
export function formatDate(date: Date, locale: string = 'zh-CN'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 获取星期几 (0 = 周日, 6 = 周六)
 */
export function getWeekday(date: Date): number {
  return date.getDay();
}

/**
 * 添加天数
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 减去天数
 */
export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

/**
 * 计算两个日期之间的天数差
 */
export function diffDays(date1: Date, date2: Date): number {
  const time1 = new Date(date1).setHours(0, 0, 0, 0);
  const time2 = new Date(date2).setHours(0, 0, 0, 0);
  const diff = time1 - time2;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * 判断是否为周末
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
