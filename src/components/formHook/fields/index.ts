import { RHFArray } from "./rhfArray";
import { RHFAutocomplete } from "./rhfAutocomplete";
import { RHFCheckbox } from "./rhfCheckbox";
import { RHFDatePicker } from "./rhfDatePicker";
import { RHFSelect } from "./rhfSelect";
import { RHFSwitch } from "./rhfSwitch";
import { RHFTextField } from "./rhfTextField";
import { RHFToggleButtonGroup } from "./rhfToggleButtonGroup";
import { RHFUploadAvatar } from "./rhfUpload";

export const RHFField = {
  Switch: RHFSwitch,
  UploadAvatar: RHFUploadAvatar,
  TextField: RHFTextField,
  ToggleButtonGroup: RHFToggleButtonGroup,
  Autocomplete: RHFAutocomplete,
  Select: RHFSelect,
  Array: RHFArray,
  Checkbox: RHFCheckbox,
  DatePicker: RHFDatePicker,
}