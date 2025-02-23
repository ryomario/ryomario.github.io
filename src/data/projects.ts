export type Project = {
  id: number
  name: string
  title: string
  desc: string
  imgUrl: string
  tags: string[]
  dateCreated: Date
}

// default values (callback values), the real values are fetched from i18n messages
export const projectsData: Project[] = [
  {
    name: "webstatic_bookshelf",
    title: "Webstatic BookShelf",
    desc: "BookShelf web application",
    imgUrl: "https://github.com/ryomario/webstatic-bookshelf/blob/main/images/preview%20%5Btheme%20dark%5D.png?raw=true",
    tags: [
      "Web Application",
    ],
    dateCreated: new Date('02-08-2022'),
  },
  {
    name: "homepage",
    title: "Homepage",
    desc: "Web application build with ReactJS. Includes a simple clock app and the main function is to store some URL in web storage.",
    imgUrl: "https://github.com/ryomario/homepage/blob/main/images/preview.png?raw=true",
    tags: [
      "Web Application",
    ],
    dateCreated: new Date('11-12-2023'),
  },
  {
    name: "calcku",
    title: "CalcKu",
    desc: "Calculator web based application. Do some actions like real calculator.",
    imgUrl: "https://github.com/ryomario/calcku/blob/main/images/preview.png?raw=true",
    tags: [
      "Web Application",
    ],
    dateCreated: new Date('02-19-2024'),
  },
]
.map((data, id) => ({...data,id: id +1})) // set id by array index
