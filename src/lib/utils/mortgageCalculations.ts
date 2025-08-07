import type { PaymentType } from '$lib/interfaces';

export function calculateAnnuityPayment(principal: number, monthlyRate: number, months: number): number {
	if (monthlyRate === 0) return principal / months;
	return (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1);
}

export function calculateDecliningPayments(principal: number, monthlyRate: number, months: number) {
	const principalPayment = principal / months;

	// First payment (highest interest)
	const firstInterest = principal * monthlyRate;
	const firstPayment = principalPayment + firstInterest;

	// Middle payment (around month months/2)
	const middleMonth = Math.floor(months / 2);
	const remainingPrincipalMiddle = principal - principalPayment * middleMonth;
	const middleInterest = remainingPrincipalMiddle * monthlyRate;
	const middlePayment = principalPayment + middleInterest;

	// Last payment (lowest interest)
	const lastInterest = principalPayment * monthlyRate;
	const lastPayment = principalPayment + lastInterest;

	// Calculate total interest
	let totalInterest = 0;
	for (let i = 0; i < months; i++) {
		const remainingPrincipal = principal - principalPayment * i;
		totalInterest += remainingPrincipal * monthlyRate;
	}

	return {
		firstPayment,
		middlePayment,
		lastPayment,
		totalInterest
	};
}

export function calculateWithExtraPayments(
	principal: number,
	monthlyRate: number,
	months: number,
	extraAnnualPayment: number,
	paymentType: PaymentType
) {
	if (extraAnnualPayment === 0) {
		return { totalInterest: 0, totalMonths: months };
	}

	const extraMonthlyPayment = extraAnnualPayment / 12;
	let remainingPrincipal = principal;
	let totalInterest = 0;
	let monthCount = 0;

	if (paymentType === 'annuity') {
		const basePayment = calculateAnnuityPayment(principal, monthlyRate, months);

		while (remainingPrincipal > 0.01 && monthCount < months * 2) {
			// Safety limit
			const interestPayment = remainingPrincipal * monthlyRate;
			const principalPayment = basePayment - interestPayment + extraMonthlyPayment;

			totalInterest += interestPayment;
			remainingPrincipal -= principalPayment;
			monthCount++;

			if (remainingPrincipal <= 0) break;
		}
	} else {
		// Declining payments
		const basePrincipalPayment = principal / months;

		while (remainingPrincipal > 0.01 && monthCount < months * 2) {
			// Safety limit
			const interestPayment = remainingPrincipal * monthlyRate;
			const principalPayment = basePrincipalPayment + extraMonthlyPayment;

			totalInterest += interestPayment;
			remainingPrincipal -= principalPayment;
			monthCount++;

			if (remainingPrincipal <= 0) break;
		}
	}

	return { totalInterest, totalMonths: monthCount };
}

export function calculateMaximumLoanAmount(
	monthlyBudget: number,
	interestRate: number,
	loanTermMonths: number,
	downPayment: number,
	paymentType: PaymentType,
	maxPercentage: number = 28
): { maxLoanAmount: number; maxPrincipal: number; maxMonthlyPayment: number } {
	const maxMonthlyPayment = (monthlyBudget * maxPercentage) / 100;
	const monthlyRate = interestRate / 100 / 12;

	let maxPrincipal: number;

	if (paymentType === 'annuity') {
		// For annuity: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
		// Solving for P: P = PMT * [(1+r)^n - 1] / [r(1+r)^n]
		if (monthlyRate === 0) {
			maxPrincipal = maxMonthlyPayment * loanTermMonths;
		} else {
			const factor = Math.pow(1 + monthlyRate, loanTermMonths);
			maxPrincipal = (maxMonthlyPayment * (factor - 1)) / (monthlyRate * factor);
		}
	} else {
		// For declining payments, use the first payment as the limiting factor
		// First payment = P/n + P*r, where P is principal, n is months, r is monthly rate
		// Solving for P: P = maxMonthlyPayment / (1/n + r)
		const principalFactor = 1 / loanTermMonths;
		maxPrincipal = maxMonthlyPayment / (principalFactor + monthlyRate);
	}

	const maxLoanAmount = maxPrincipal + downPayment;

	return {
		maxLoanAmount,
		maxPrincipal,
		maxMonthlyPayment
	};
}
