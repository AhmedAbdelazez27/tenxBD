// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'truncateHtml',
//   standalone: true
// })
// export class TruncateHtmlPipe implements PipeTransform {

//   transform(value: unknown, ...args: unknown[]): unknown {
//     return null;
//   }

// }
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHtml',
  standalone: true
})
export class TruncateHtmlPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (!value) return '';
    const plainText = value.replace(/<[^>]+>/g, ''); // Strip HTML tags
    return plainText.length > limit
      ? plainText.substring(0, limit) + '...'
      : plainText;
  }
}
