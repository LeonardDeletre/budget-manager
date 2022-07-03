export const getDonutChartData = (themes: ColorThemes, list: number[]) => {

  const generatedData = {
    labels: ['Rent', 'Transport', 'Food', 'Entertainment', 'Other'],
    datasets: [{
      label: 'Dépenses du mois selon les catégories',
      backgroundColor: [themes.danger, themes.info, themes.primary, themes.success, themes.warning],
      data: list,
    }],
  }

  return generatedData
}
