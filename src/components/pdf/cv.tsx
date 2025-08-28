import { CVProperties } from "@/data/cv";
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { AbstractIntlMessages, createTranslator } from "next-intl";
import { fontStyles, styles } from "./styles";
import { TextPerWord } from "./components/textPerWord";
import { ListView } from "./components/listView";
import { getMonthName } from "@/lib/date";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { getLanguageLevel } from "@/lib/language";
import { Locale } from "@/i18n/routing";

type Props = {
  messages: AbstractIntlMessages
  locale: Locale
  data: CVProperties
}

export function CV({ data, messages, locale }: Props) {
  const t = createTranslator({
    locale,
    messages,
    namespace: 'CV'
  });

  const profile_picture = sharp(
    fs.readFileSync(path.join(process.cwd(),'public',data.profile.profile_picture))
  ).png().toBuffer();

  return (
    <Document
      author={data.profile.name}
      title={t('title',{name: data.profile.name, year: new Date().getFullYear()})}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={[styles.section,{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 20,
        }]}>
          <Image src={profile_picture} style={styles.profileImg}/>
          <View style={{ width: '100%' }}>
            <Text style={fontStyles.heading_1}>{data.profile.name}</Text>
            <TextPerWord style={fontStyles.normal} text={data.profile.intro}/>
          </View>
        </View>
        <View style={[styles.section]}>
          <Text style={[fontStyles.normal,fontStyles.center]}>{data.profile.address}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[fontStyles.heading_2,fontStyles.section_title]}>{t('work_experience')}</Text>
          {
            data.work_experiences.map((exp, i) => (
              <View style={styles.work_section} key={i}>
                <Text style={fontStyles.heading_3}> - </Text>
                <View style={{ width: '100%' }}>
                  <Text style={[fontStyles.heading_3,{ display: 'flex' }]}>
                    <Text>{exp.jobTitle}</Text>
                    <Text> - </Text>
                    <Text style={fontStyles.muted}>{exp.companyName}</Text>
                  </Text>
                  <Text style={[fontStyles.normal,fontStyles.muted]}>{`${getMonthName(exp.startDate_month, false, locale)} ${exp.startDate_year}`} - {(exp.endDate_month && exp.endDate_year) ? `${getMonthName(exp.endDate_month, false, locale)} ${exp.endDate_year}` : t('present')}</Text>
                  <TextPerWord style={fontStyles.normal} text={exp.description}/>
                </View>
              </View>
            ))
          }
        </View>
        <View style={styles.section}>
          <Text style={[fontStyles.heading_2,fontStyles.section_title]}>{t('education')}</Text>
          {
            data.educations.map((edu, i) => (
              <View style={styles.work_section} key={i}>
                <Text style={fontStyles.heading_3}> - </Text>
                <View style={{ width: '100%' }}>
                  <Text style={[fontStyles.heading_3,{ display: 'flex', flexWrap: 'wrap' }]}>
                    <Text>{edu.schoolName}</Text>
                    <Text style={fontStyles.muted}> ({edu.startYear} - {edu.endYear})</Text>
                  </Text>
                  <Text style={[fontStyles.normal,{ display: 'flex', flexWrap: 'wrap', marginTop: 5 }]}>
                    <Text>{edu.degree}</Text>
                    <Text style={fontStyles.muted}> ({t('gpa')} {edu.gpa}{edu.gpa_scale ? `/${edu.gpa_scale}` : ''})</Text>
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
            <ListView list={data.profile.professional.skills} style={[fontStyles.normal,{ fontWeight: 'bold', lineHeight: 1.5 }]}/>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={[fontStyles.heading_2]}>{t('languages')}</Text>
            <View style={[fontStyles.hr,{ borderBottomColor: '#ffffff' }]}></View>
            <ListView list={data.profile.professional.languages.map(lang => `${lang.name} - ${getLanguageLevel(lang.level, locale)}`)} style={[fontStyles.normal,{ fontWeight: 'bold', lineHeight: 1.5 }]}/>
          </View>
        </View>
      </Page>
    </Document>
  )
}
