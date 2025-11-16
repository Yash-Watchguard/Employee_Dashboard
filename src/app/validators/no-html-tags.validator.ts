import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noHtmlTagsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = /<[^>]*>/g.test(control.value);
    return forbidden ? { htmlTagsNotAllowed: true } : null;
  };
}
