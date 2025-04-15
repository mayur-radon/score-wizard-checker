
import React, { useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Link, Image, 
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3,
  AlignJustify, Type, Code, Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [htmlContent, setHtmlContent] = useState(value);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [editor, setEditor] = useState<HTMLTextAreaElement | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  useEffect(() => {
    setHtmlContent(value);
  }, [value]);

  useEffect(() => {
    onChange(htmlContent);
  }, [htmlContent, onChange]);

  const handleEditorRef = (ref: HTMLTextAreaElement | null) => {
    setEditor(ref);
  };

  const saveSelection = () => {
    if (editor) {
      setSelection({
        start: editor.selectionStart,
        end: editor.selectionEnd
      });
    }
  };

  const restoreSelection = () => {
    if (editor) {
      editor.focus();
      editor.setSelectionRange(selection.start, selection.end);
    }
  };

  const insertAtCursor = (before: string, after: string = '') => {
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = htmlContent.substring(start, end);
    const newText = htmlContent.substring(0, start) + 
                    before + selectedText + after + 
                    htmlContent.substring(end);
    
    setHtmlContent(newText);
    
    // Set cursor position after the operation
    setTimeout(() => {
      editor.focus();
      editor.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatText = (tag: string) => {
    saveSelection();
    const selectedText = htmlContent.substring(selection.start, selection.end);
    insertAtCursor(`<${tag}>`, `</${tag}>`);
  };

  const insertHeading = (level: number) => {
    saveSelection();
    const tag = `h${level}`;
    const selectedText = htmlContent.substring(selection.start, selection.end);
    insertAtCursor(`<${tag}>`, `</${tag}>`);
  };

  const insertList = (ordered: boolean) => {
    saveSelection();
    const tag = ordered ? 'ol' : 'ul';
    const selectedText = htmlContent.substring(selection.start, selection.end);
    const listItems = selectedText
      .split('\n')
      .map(item => item.trim() ? `<li>${item}</li>` : '')
      .join('');
    
    insertAtCursor(`<${tag}>` + (listItems || '<li></li>') + `</${tag}>`);
  };

  const insertLink = () => {
    if (!linkUrl) return;
    
    restoreSelection();
    const text = linkText || linkUrl;
    insertAtCursor(`<a href="${linkUrl}" target="_blank">`, `</a>`);
    
    // Reset the form
    setLinkUrl('');
    setLinkText('');
    setShowLinkDialog(false);
  };

  const insertImage = () => {
    if (!imageUrl) return;
    
    restoreSelection();
    insertAtCursor(`<img src="${imageUrl}" alt="${imageAlt || 'Image'}" class="max-w-full h-auto rounded my-2" />`);
    
    // Reset the form
    setImageUrl('');
    setImageAlt('');
    setShowImageDialog(false);
  };

  return (
    <div className="border rounded-md bg-background">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('b')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('i')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('u')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <span className="border-r mx-1 h-6"></span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHeading(1)}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHeading(2)}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHeading(3)}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <span className="border-r mx-1 h-6"></span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('p')}
          title="Paragraph"
        >
          <Type className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertList(false)}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertList(true)}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <span className="border-r mx-1 h-6"></span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('code')}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('blockquote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <span className="border-r mx-1 h-6"></span>
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => saveSelection()}
              title="Insert Link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="url">URL</label>
                <Input 
                  id="url" 
                  placeholder="https://example.com" 
                  value={linkUrl} 
                  onChange={(e) => setLinkUrl(e.target.value)} 
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="text">Link Text (optional)</label>
                <Input 
                  id="text" 
                  placeholder="Click here" 
                  value={linkText} 
                  onChange={(e) => setLinkText(e.target.value)} 
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={insertLink}>Insert Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => saveSelection()}
              title="Insert Image"
            >
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="imageUrl">Image URL</label>
                <Input 
                  id="imageUrl" 
                  placeholder="https://example.com/image.jpg" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="imageAlt">Alt Text (for accessibility)</label>
                <Input 
                  id="imageAlt" 
                  placeholder="Description of the image" 
                  value={imageAlt} 
                  onChange={(e) => setImageAlt(e.target.value)} 
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={insertImage}>Insert Image</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <span className="border-r mx-1 h-6"></span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertAtCursor('<div class="text-left">', '</div>')}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertAtCursor('<div class="text-center">', '</div>')}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertAtCursor('<div class="text-right">', '</div>')}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertAtCursor('<div class="text-justify">', '</div>')}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea
        ref={handleEditorRef}
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        className="font-mono min-h-[300px] resize-y p-3 border-0 focus-visible:ring-0"
        placeholder="Write your HTML content here..."
      />
      
      <div className="p-3 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">
          Preview:
        </div>
        <div 
          className="p-4 bg-background border rounded mt-2 min-h-[100px] prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
