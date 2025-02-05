import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderBy',
    standalone: false
})
export class OrderByPipe implements PipeTransform {

	/**
   *
   * @param value an array
   * @param sortFunction asc or desc
   * @returns the sam array
   */
	transform (value: any[], sortFunction?: string): any[] {
		return value.sort((a, b) => {
			const sorted = 'asc' === sortFunction ? a.order - b.order : b.order - a.order;
			return sorted;
		});
	}
}
