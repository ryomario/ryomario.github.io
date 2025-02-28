import { CVProperties } from "@/data/cv";
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { AbstractIntlMessages, createTranslator } from "next-intl";
import { fontStyles, styles } from "./styles";
import { TextPerWord } from "./components/textPerWord";
import { ListView } from "./components/listView";

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
        <View style={[styles.section,{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 20,
        }]}>
          <Image src='./public/profile.png' style={styles.profileImg}/>
          <View style={{ width: '100%' }}>
            <Text style={fontStyles.heading_1}>{data.name}</Text>
            <TextPerWord style={fontStyles.normal} text={data.aboutme}/>
          </View>
        </View>
        <View style={[styles.section]}>
          <Text style={[fontStyles.normal,fontStyles.center]}>{data.location}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[fontStyles.heading_2,fontStyles.section_title]}>{t('work_experience')}</Text>
          {
            data.work_experiences.map((exp, i) => (
              <View style={styles.work_section} key={i}>
                <Text style={fontStyles.heading_3}> - </Text>
                <View style={{ width: '100%' }}>
                  <Text style={[fontStyles.heading_3,{ display: 'flex' }]}>
                    <Text>{exp.position}</Text>
                    <Text> - </Text>
                    <Text style={fontStyles.muted}>{exp.instance_name}</Text>
                  </Text>
                  <Text style={[fontStyles.normal,fontStyles.muted]}>{exp.start_date} - {exp.end_date}</Text>
                  <TextPerWord style={fontStyles.normal} text={exp.description}/>
                </View>
              </View>
            ))
          }
        </View>
        <View style={styles.section}>
          <Text style={[fontStyles.heading_2,fontStyles.section_title]}>{t('education')}</Text>
          {
            data.education.map((edu, i) => (
              <View style={styles.work_section} key={i}>
                <Text style={fontStyles.heading_3}> - </Text>
                <View style={{ width: '100%' }}>
                  <Text style={[fontStyles.heading_3,{ display: 'flex', flexWrap: 'wrap' }]}>
                    <Text>{edu.instance_name}</Text>
                    <Text> - </Text>
                    <Text>{edu.instance_location}</Text>
                    <Text style={fontStyles.muted}> ({edu.start_date} - {edu.end_date})</Text>
                  </Text>
                  <Text style={[fontStyles.normal,fontStyles.muted]}>{edu.description}</Text>
                </View>
              </View>
            ))
          }
        </View>
        <View style={[styles.section,{
          backgroundColor: '#647b71',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'row',
          gap: 20,
          marginTop: 20,
          paddingTop: 20,
          flexGrow: 1,
        }]}>
          <View style={{ width: '50%' }}>
            <Text style={[fontStyles.heading_2]}>{t('skills')}</Text>
            <View style={[fontStyles.hr,{ borderBottomColor: '#ffffff' }]}></View>
            <ListView list={data.skills} style={[fontStyles.normal,{ fontWeight: 'bold', lineHeight: 1.5 }]}/>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={[fontStyles.heading_2]}>{t('languages')}</Text>
            <View style={[fontStyles.hr,{ borderBottomColor: '#ffffff' }]}></View>
            <ListView list={data.languages.map(lang => `${lang.name} - ${lang.level}`)} style={[fontStyles.normal,{ fontWeight: 'bold', lineHeight: 1.5 }]}/>
          </View>
        </View>
      </Page>
    </Document>
  )
}
