import { Agreement } from '../entities/agreement.entity.js';
import { AgreementVersion } from '../value-objects/agreement-version.vo.js';

export function createNextAgreementVersion(
  agreement: Agreement,
  text: string,
  createdAt: AgreementVersion['createdAt'],
  createdBy: AgreementVersion['createdBy']
): Agreement {
  const existingVersions = agreement.versions;
  const currentMax = existingVersions.length > 0 ? Math.max(...existingVersions.map((version) => version.version)) : 0;
  const version = AgreementVersion.create({ version: currentMax + 1, text, createdAt, createdBy });
  return agreement.addVersion(version);
}
