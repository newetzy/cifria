import { calculateIrpf, type IrpfInput } from '../lib/calculations/irpf';
import { formatEuro } from '../lib/formatters/currency';

const form = document.querySelector<HTMLFormElement>('#irpf-form');
if (!form) throw new Error('No se encontró el formulario de IRPF.');
const results = document.querySelector<HTMLElement>('#irpf-results')!;
const announcement = document.querySelector<HTMLElement>('#irpf-announcement')!;
const errorMessage = document.querySelector<HTMLElement>('#irpf-error')!;
const readNumber = (id: string) => form.querySelector<HTMLInputElement>(`#${id}`)!.valueAsNumber;

form.addEventListener('submit', (event) => {
  event.preventDefault(); errorMessage.hidden = true; errorMessage.textContent = ''; announcement.textContent = '';
  try {
    const input: IrpfInput = {
      salary: readNumber('salary'), otherIncome: readNumber('otherIncome'), savingsIncome: readNumber('savingsIncome'),
      socialContributions: readNumber('socialContributions'), withheld: readNumber('withheld'), age: readNumber('age'),
      disability: form.querySelector<HTMLSelectElement>('#disability')!.value as IrpfInput['disability'],
      community: form.querySelector<HTMLSelectElement>('#community')!.value as IrpfInput['community'],
    };
    const result = calculateIrpf(input);
    for (const [key, value] of Object.entries({ tax: result.estimatedTax, balance: Math.abs(result.balance), base: result.generalBase, savings: result.savingsBase, minimum: result.personalMinimum, 'state-tax': result.stateTax, 'autonomous-tax': result.autonomousTax })) {
      document.querySelector<HTMLElement>(`[data-result="${key}"]`)!.textContent = formatEuro(value);
    }
    document.querySelector<HTMLElement>('[data-result="balance-label"]')!.textContent = result.balance > 0 ? 'Diferencia orientativa a ingresar' : result.balance < 0 ? 'Diferencia orientativa a devolver' : 'Sin diferencia orientativa';
    results.hidden = false;
    announcement.textContent = `Total estimado: ${formatEuro(result.estimatedTax)}. Cuota estatal: ${formatEuro(result.stateTax)}. Cuota autonómica: ${formatEuro(result.autonomousTax)}.`;
  } catch (error) {
    results.hidden = true; errorMessage.textContent = error instanceof Error ? error.message : 'No se ha podido calcular.'; errorMessage.hidden = false;
  }
});
