import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const TEMPLATE_OPTIONS = [
  { value: 'traditional', label: 'Traditional' },
  { value: 'modern', label: 'Modern' },
//  { value: 'creative', label: 'Creative' },
  //{ value: 'minimalist', label: 'Minimalist' },
  { value: 'professional', label: 'Professional' },
] as const;

type TemplateLayout = typeof TEMPLATE_OPTIONS[number]['value'];

export function CoverLetterTemplateSwitch() {
  const { state, updateCoverLetter } = useCoverLetter();
  const layout = state.coverLetter.formatting?.layout || 'traditional';

  const handleChange = (value: TemplateLayout) => {
    updateCoverLetter({
      formatting: {
        ...state.coverLetter.formatting,
        layout: value,
      },
    });
  };

  return (
    <div className="flex flex-col  min-w-[180px] border rounded-sm border-primary">
      {/* <Label>Design Template</Label> */}
      <Select value={layout} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TEMPLATE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
