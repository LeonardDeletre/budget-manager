let generatedData: {
  labels: string[];
  datasets: {label: string; backgroundColor: string[]; data: number[]}[];
}

export const getDonutChartData = (themes: ColorThemes, list: number[]) => {
  if (generatedData) {
    generatedData.datasets[0].backgroundColor = [themes.danger, themes.info, themes.primary, themes.success, themes.warning]
  } else {
    generatedData = {
      labels: ['Rent', 'Transport', 'Food', 'Entertainment', 'Other'],
      datasets: [{
        label: 'Dépenses du mois selon les catégories',
        backgroundColor: [themes.danger, themes.info, themes.primary, themes.success, themes.warning],
        data: list,
      }],
    }
  }

  return generatedData
}
