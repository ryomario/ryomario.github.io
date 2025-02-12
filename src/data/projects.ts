export type Project = {
  id: number
  title: string
  desc: string
  imgUrl: string
  tags: string[]
  dateCreated: Date
}

export const projectsData: Project[] = [
  {
    title: "Webstatic BookShelf",
    desc: "BookShelf web application",
    imgUrl: "https://github.com/ryomario/webstatic-bookshelf/blob/main/images/preview%20%5Btheme%20dark%5D.png?raw=true",
    tags: [
      "Web Application",
    ],
    dateCreated: new Date('02-08-2022'),
  },
  {
    title: "Homepage",
    desc: "Web application build with ReactJS. Includes a simple clock app and the main function is to store some URL in web storage.",
    imgUrl: "https://github.com/ryomario/homepage/blob/main/images/preview.png?raw=true",
    tags: [
      "Web Application",
    ],
    dateCreated: new Date('11-12-2023'),
  },
  {
    title: "CalcKu",
    desc: "Calculator web based application. Do some actions like real calculator.",
    imgUrl: "https://github.com/ryomario/calcku/blob/main/images/preview.png?raw=true",
    tags: [
      "Web Application",
    ],
    dateCreated: new Date('02-19-2024'),
  },
]
.map((data, id) => ({...data,id})) // set id by array index

export const projectTagsData: string[] =
  projectsData.reduce<string[]>((arr,project) => arr.concat(...project.tags),[]) // get all tags from existing data
  .filter((str, i, self) => i === self.indexOf(str)) // get unique tags