import { CVProperties } from "@/data/cv";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { AbstractIntlMessages, createTranslator } from "next-intl";
import { styles } from "./styles";

type Props = {
  messages: AbstractIntlMessages
  locale: string
  data: CVProperties
}

export function CV({ data, messages, locale }: Props) {
  const t = createTranslator({
    locale,
    messages,
    namespace: 'CV'
  })

  return (
    <Document
      author={data.name}
      title={t('title',{name: data.name, year: new Date().getFullYear()})}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <Text>{t('section',{num: 1})}</Text>
        </View>
        <View style={styles.section}>
          <Text>{t('section',{num: 2})}</Text>
        </View>
      </Page>
    </Document>
  )
}
