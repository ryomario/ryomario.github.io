import { ILicense, ILicenseFilter, ILicenseSortableProperties } from "@/types/ILicense";
import { getErrorMessage } from "@/utils/errorMessage";
import { Logger } from "@/utils/logger";
import { prisma } from "../prisma";
import { IPaginationParams } from "@/types/IPagination";
import { ArrayOrder } from "@/lib/array";

type GetAllParams = Partial<IPaginationParams> & {
  filter?: ILicenseFilter;
  order?: ArrayOrder;
  orderBy?: ILicenseSortableProperties;
}

async function getAll({ filter, offset = 0, limit = 0, order, orderBy }: GetAllParams = { limit: 0, offset: 0 }): Promise<ILicense[]> {
  try {
    const licenses = await prisma.license.findMany({
      skip: offset,
      take: limit > 0 ? limit : undefined,
      where: filter ? {
        OR: [
          {
            name: {
              contains: filter.q,
            }
          },
          {
            orgName: {
              contains: filter.q,
            }
          }
        ],
      } : undefined,
      orderBy: (
        orderBy == 'name' ? ({ name: order })
          : orderBy == 'issueDate' ? ([
            {
              startDate_year: order,
            }, {
              startDate_month: order,
            }
          ]) : orderBy == 'expirationDate' ? ([
            {
              endDate_year: order,
            }, {
              endDate_month: order,
            }
          ]) : orderBy == 'hidden' ? ({
            hidden: order,
          }) : undefined
      ),
    });
    if (!licenses) throw Error(`any licenses not found`);

    Logger.info(`"${licenses.length}" data loaded!`, 'licenses getAll');
    return licenses;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'licenses getAll error');

    throw new Error(message);
  }
}

async function getOne(id: number): Promise<ILicense> {
  try {
    const license = await prisma.license.findFirst({
      where: {
        id,
      }
    });
    if (!license) throw Error(`license with id "${id}" not found`);

    Logger.info(`data with id "${license.id}" loaded!`, 'licenses getOne');
    return license;
  } catch (error) {
    const message = getErrorMessage(error);

    Logger.error(message, 'license getOne error');

    throw new Error(message);
  }
}

export default {
  getAll,
  getOne,
}