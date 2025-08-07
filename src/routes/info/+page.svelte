<main class="main-content flex-1 pb-8 min-h-screen">
	<div class="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-6">
		<h1 class="text-3xl font-bold text-gray-800 mb-6">Информация за сайта</h1>
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-gray-700 mb-4">Цел на проекта</h2>
			<p class="text-gray-600 leading-relaxed mb-4">
				Този сайт е създаден с идеята всеки потребител сам да може да изчисли до каква степен са му засегнати месечните разходи от промените в
				цените на основната потребителска кошница. Целта е да разберете дали заплатата ви сега има по-голяма или по-малка покупателна сила
				спрямо предишен период.
			</p>
			<p class="text-gray-600 leading-relaxed mb-4">
				Филтрите, които избирате в сайта, директно влияят на калкулатора при изчислението на тези данни, което ви позволява да персонализирате
				анализа според вашите конкретни потребности и разходи.
			</p>
			<p class="text-gray-600 leading-relaxed">
				Освен анализа на покупателната сила, сайтът предлага и напреднал
				<a href="#mortgage-calculator" class="font-bold underline">ипотечен калкулатор</a>, който ви помага да планирате покупката на недвижим
				имот и да разберете финансовите си възможности при различни кредитни условия.
			</p>
		</section>
		<h3 class="text-2xl font-semibold text-gray-700 mb-4">1. Анализатор на потребителските цени</h3>
		<div class="wrapper bg-gray-100 p-4 rounded-lg shadow-md border-gray-400 mb-8">
			<section class="mb-8">
				<h2 class="text-2xl font-semibold text-gray-700 mb-4">Източници на данните</h2>

				<div class="space-y-6 px-4">
					<div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
						<h3 class="text-lg font-semibold text-blue-800 mb-2">Данни за цените на храните</h3>
						<p class="text-blue-700">
							Информацията за цените на храните се взема от <strong>Eurostat</strong> и представлява хармонизиран индекс на потребителските
							цени, а не точните цени в магазините. Данните се актуализират на месечна база и покриват последните 10 години.
						</p>
					</div>

					<div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
						<h3 class="text-lg font-semibold text-yellow-800 mb-2">Данни за електроенергията</h3>
						<p class="text-yellow-700">
							Данните за цените на тока също идват от <strong>Eurostat</strong> и се актуализират на 6-месечна база. Важно е да се отбележи,
							че новите данни се показват едва след като съответното полугодие приключи напълно.
						</p>
					</div>

					<div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
						<h3 class="text-lg font-semibold text-green-800 mb-2">Данни за горивата</h3>
						<p class="text-green-700">
							Цените на горивата се взимат в реално време от <strong>Fuelo</strong> с точност до ден, което осигурява най-актуалната информация
							за промените в цените на бензина и дизела.
						</p>
					</div>

					<div class="bg-cyan-50 p-4 rounded-lg border-l-4 border-cyan-400">
						<h3 class="text-lg font-semibold text-cyan-800 mb-2">Данни за водата</h3>
						<p class="text-cyan-700">
							Информацията за цените на водата е събрана от сайта на <strong>Софийска вода</strong>. Моля, имайте предвид, че тези данни
							не са точни за цяла България, тъй като няма единно API за водоснабдителните дружества в страната.
						</p>
					</div>
				</div>
			</section>

			<section class="mb-8">
				<h2 class="text-2xl font-semibold text-gray-700 mb-4">Ограничения и бележки</h2>
				<div class="p-4">
					<ul class="list-disc list-inside text-gray-600 space-y-2">
						<li>Данните за храните представляват индекси, а не абсолютни цени!</li>
						<li>Данните за тока се актуализират със забавяне от 6 месеца!</li>
						<li>Данните за водата са валидни основно за София и околностите!</li>
						<li>Резултатите са ориентировъчни и служат за сравнителен анализ!</li>
					</ul>
				</div>
			</section>

			<section class="mb-8">
				<h2 class="text-2xl font-semibold text-gray-700 mb-4">Как да използвате формата</h2>
				<p class="text-gray-600 leading-relaxed">
					Използвайте филтрите и настройките, за да персонализирате анализа според вашите конкретни разходи и потребности. Колкото по-точно
					въведете данните си, толкова по-прецизна ще бъде оценката за промяната в покупателната ви сила.
				</p>
			</section>
		</div>
		<h3 id="mortgage-calculator" class="text-2xl font-semibold text-gray-700 mb-4">2. Ипотечен калкулатор</h3>
		<div class="wrapper bg-gray-100 p-4 rounded-lg shadow-md border-gray-400">
			<p class="text-gray-600 leading-relaxed mb-4">
				Сайтът включва и напреднал ипотечен калкулатор, който ви помага да планирате покупката на имот и да разберете финансовите ви
				възможности при различни сценарии на кредитиране. Този инструмент е проектиран да ви предостави пълна картина за вашите задължения и
				възможности за оптимизация на кредита.
			</p>

			<div class="space-y-4 px-4">
				<div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
					<h3 class="text-lg font-semibold text-purple-800 mb-2">Основни функции</h3>
					<ul class="text-purple-700 space-y-1">
						<li>
							• Изчисляване на месечни вноски при <strong>анюитетни</strong> и <strong>намаляващи</strong>
							плащания
						</li>
						<li>• Анализ на процента от дохода, който заема ипотечната вноска (препоръчителен под 30%)</li>
						<li>• Автоматични препоръки за максимални стойности на кредитиране според вашия доход</li>
						<li>• Калкулиране на ефекта от допълнителни годишни вноски и тяхното влияние</li>
						<li>• Сравнение между различни сценарии на кредитиране</li>
					</ul>
				</div>

				<div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
					<h3 class="text-lg font-semibold text-indigo-800 mb-2">Подробни резултати и анализи</h3>
					<ul class="text-indigo-700 space-y-1">
						<li>• Общ лихвен разход и обща сума за връщане през целия период</li>
						<li>• Точни спестявания при допълнителни вноски с конкретни суми</li>
						<li>• Съкращаване на срока при предсрочни плащания в месеци и години</li>
						<li>• Визуално предупреждение при надвишаване на препоръчителния процент от дохода</li>
						<li>• Интерактивни препоръки за оптимизация на кредитните условия</li>
					</ul>
				</div>

				<div class="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-400">
					<h3 class="text-lg font-semibold text-emerald-800 mb-2">Типове планове за погасяване</h3>
					<div class="text-emerald-700 space-y-2">
						<p>
							<strong>Анюитетни плащания:</strong> Равни месечни вноски през целия период - по-лесни за планиране на бюджета.
						</p>
						<p>
							<strong>Намаляващи плащания:</strong> По-високи в началото, но намаляват всеки месец - общо по-ниски лихви.
						</p>
					</div>
				</div>

				<div class="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
					<h3 class="text-lg font-semibold text-orange-800 mb-2">Интелигентни препоръки</h3>
					<ul class="text-orange-700 space-y-1">
						<li>• Автоматично предупреждение ако процентът от дохода е над 28%</li>
						<li>• Препоръки за подходящи суми на кредита според доходите</li>
						<li>• Съвети за оптимизация чрез допълнителни вноски</li>
						<li>• Анализ на финансовата устойчивост при различни сценарии</li>
					</ul>
				</div>

				<div class="p-4">
					<h3 class="text-lg font-semibold text-slate-800">Как да използвате калкулатора</h3>
					<ol class="text-slate-700 space-y-2 list-decimal list-inside">
						<li>Въведете основните параметри: сума на кредита, лихвен процент и срок</li>
						<li>Посочете месечния си доход за автоматично изчисляване на препоръките</li>
						<li>Изберете тип на плащанията (анюитетни или намаляващи)</li>
						<li>Експериментирайте с допълнителни годишни вноски за оптимизация</li>
						<li>Анализирайте резултатите и препоръките за най-добро решение</li>
					</ol>
				</div>
				<div class="p-4 mb-2">
					<h3 class="text-lg font-semibold mb-2">Поддържани валути и настройки</h3>
					<div class=" space-y-2">
						<p>
							Калкулаторът работи с <strong class="text-teal-700">BGN и EUR</strong>, като промяната на валутата е само за визуализация
							и не влияе на изчисленията.
						</p>
						<p>
							Всички настройки се запазват автоматично, което ви позволява да експериментирате с различни варианти без да загубите
							въведените данни.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
