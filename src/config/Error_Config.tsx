interface propTypes {
  error: string;
  entityNameFormatted: string;
}

export const PostErrorConfig = ({ error, entityNameFormatted }: propTypes) => {
  let errorMessage = `Error Creating ${entityNameFormatted}`;

  if (error.includes("User already exists")) {
    errorMessage = "This email is already registered. Please use another";
  } else if (error.includes("Duplicate entry")) {
    errorMessage = "This entry already exists. Please use another";
  } else if (error.includes("Name already exists")) {
    errorMessage = "This name already exists. Please use a different name";
  } else if (error.includes("already exists")) {
    errorMessage = "This item already exists. Please use a different name";
  }

  return errorMessage;
};

interface patchPropTypes {
  error: string;
  entityNameFormatted: string;
}

export const PatchErrorConfig = ({
  entityNameFormatted,
  error,
}: patchPropTypes) => {
  switch (error) {
    default:
      return `Error updating ${entityNameFormatted}`;
  }
};

const entityName = "Entity";
const entityNamePlural = "Entities";
const entityNameLower = entityName.toLowerCase();
const entityNamePluralLower = entityNamePlural.toLowerCase();
const entityNameCamel = entityNameLower;
const entityNamePluralCamel = entityNamePluralLower;
const entityNameSnake = entityNameLower;
const entityNamePluralSnake = entityNamePluralLower;
const entityNameKebab = entityNameLower;
const entityNamePluralKebab = entityNamePluralLower;
const entityNameTitle = entityName;
const entityNamePluralTitle = entityNamePlural;
const entityNameSentence = entityName;
const entityNamePluralSentence = entityNamePlural;
const entityNameUpper = entityName.toUpperCase();
const entityNamePluralUpper = entityNamePlural.toUpperCase();
const entityNameLowerFirst = entityNameLower;
const entityNamePluralLowerFirst = entityNamePluralLower;
const entityNameUpperFirst = entityName;
const entityNamePluralUpperFirst = entityNamePlural;
const entityNameCapitalize = entityName;
const entityNamePluralCapitalize = entityNamePlural;
const entityNameUncapitalize = entityNameLower;
const entityNamePluralUncapitalize = entityNamePluralLower;

export const Error_Config = {
  entityName,
  entityNamePlural,
  entityNameLower,
  entityNamePluralLower,
  entityNameCamel,
  entityNamePluralCamel,
  entityNameSnake,
  entityNamePluralSnake,
  entityNameKebab,
  entityNamePluralKebab,
  entityNameTitle,
  entityNamePluralTitle,
  entityNameSentence,
  entityNamePluralSentence,
  entityNameUpper,
  entityNamePluralUpper,
  entityNameLowerFirst,
  entityNamePluralLowerFirst,
  entityNameUpperFirst,
  entityNamePluralUpperFirst,
  entityNameCapitalize,
  entityNamePluralCapitalize,
  entityNameUncapitalize,
  entityNamePluralUncapitalize,
};