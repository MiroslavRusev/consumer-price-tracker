import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { PaymentType, EnrichedMortgageCalculationResult } from '$lib/interfaces';
import {
	calculateAnnuityPayment,
	calculateDecliningPayments,
	calculateWithExtraPayments,
	calculateMaximumLoanAmount
} from '$lib/utils/mortgageCalculations';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();

		// Extract and validate form data
		const monthlyBudget = parseFloat(formData.get('monthlyBudget') as string) || 0;
		const loanAmount = parseFloat(formData.get('loanAmount') as string) || 0;
		const downPayment = parseFloat(formData.get('downPayment') as string) || 0;
		const interestRate = parseFloat(formData.get('interestRate') as string) || 0;
		const loanTermMonths = parseInt(formData.get('loanTermMonths') as string) || 0;
		const extraPaymentPerYear = parseFloat(formData.get('extraPaymentPerYear') as string) || 0;
		const paymentType = (formData.get('paymentType') as PaymentType) || 'annuity';

		// Validation
		if (monthlyBudget <= 0) {
			return json({ error: 'Monthly budget must be greater than 0' }, { status: 400 });
		}
		if (loanAmount <= 0) {
			return json({ error: 'Loan amount must be greater than 0' }, { status: 400 });
		}
		if (downPayment < 0 || downPayment >= loanAmount) {
			return json({ error: 'Down payment must be between 0 and loan amount' }, { status: 400 });
		}
		if (interestRate < 0 || interestRate > 50) {
			return json({ error: 'Interest rate must be between 0 and 50%' }, { status: 400 });
		}
		if (loanTermMonths <= 0 || loanTermMonths > 600) {
			return json({ error: 'Loan term must be between 1 and 600 months' }, { status: 400 });
		}
		if (extraPaymentPerYear < 0) {
			return json({ error: 'Extra payment cannot be negative' }, { status: 400 });
		}
		if (!['annuity', 'declining'].includes(paymentType)) {
			return json({ error: 'Payment type must be either "annuity" or "declining"' }, { status: 400 });
		}

		const principalAmount = loanAmount - downPayment;
		const monthlyRate = interestRate / 100 / 12;

		const result: EnrichedMortgageCalculationResult = {
			monthlyBudget,
			loanAmount,
			downPayment,
			principalAmount,
			interestRate,
			loanTermMonths,
			extraPaymentPerYear,
			paymentType
		};

		if (paymentType === 'annuity') {
			// Calculate annuity payments
			const monthlyPayment = calculateAnnuityPayment(principalAmount, monthlyRate, loanTermMonths);
			const totalAmount = monthlyPayment * loanTermMonths;
			const totalInterest = totalAmount - principalAmount;

			result.monthlyPayment = monthlyPayment;
			result.totalAmount = totalAmount;
			result.totalInterest = totalInterest;
			result.paymentPercentageFromIncome = (monthlyPayment / monthlyBudget) * 100;
		} else {
			// Calculate declining payments
			const declining = calculateDecliningPayments(principalAmount, monthlyRate, loanTermMonths);
			const totalAmount = principalAmount + declining.totalInterest;

			result.firstPayment = declining.firstPayment;
			result.middlePayment = declining.middlePayment;
			result.lastPayment = declining.lastPayment;
			result.totalInterestDecline = declining.totalInterest;
			result.totalAmountDecline = totalAmount;
			// Calculate average payment (it's not exactly the middle payment, but it's very close)
			result.paymentPercentageFromIncome = (declining.middlePayment / monthlyBudget) * 100;
		}

		// Calculate with extra payments if specified
		if (extraPaymentPerYear > 0) {
			const withExtra = calculateWithExtraPayments(
				principalAmount,
				monthlyRate,
				loanTermMonths,
				extraPaymentPerYear,
				paymentType
			);

			result.totalInterestWithExtra = withExtra.totalInterest;
			result.totalAmountWithExtra = principalAmount + withExtra.totalInterest;
			result.monthsSavedWithExtra = loanTermMonths - withExtra.totalMonths;
		}

		// Validate payment percentage and provide recommendations
		const paymentPercentage = result.paymentPercentageFromIncome || 0;

		const maxRecommendation = calculateMaximumLoanAmount(
			monthlyBudget,
			interestRate,
			loanTermMonths,
			downPayment,
			paymentType,
			28
		);

		result.maximumRecommendedLoanAmount = Math.round(maxRecommendation.maxLoanAmount);
		result.maximumRecommendedPrincipal = Math.round(maxRecommendation.maxPrincipal);
		result.maximumRecommendedMonthlyPayment = Math.round(maxRecommendation.maxMonthlyPayment * 100) / 100;
		if (paymentPercentage > 28) {
			result.paymentPercentageWarning = true;
		}

		return json(result);
	} catch (error) {
		console.error('Mortgage calculation error:', error);
		return json({ error: 'Failed to calculate mortgage' }, { status: 500 });
	}
};
