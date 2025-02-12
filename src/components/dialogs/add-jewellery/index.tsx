'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

// Type Import
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material'

import { toast } from 'react-toastify'

import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { useDispatch, useSelector } from 'react-redux'

import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@/@core/components/mui/IconButton'
import ProductImage from './ProductImage'
import { fetchCategories } from '@/redux-store/slices/categorySlice'
import type { AppDispatch, RootState } from '@/redux-store/store'
import { createJewellery, updateJewellery } from '@/redux-store/slices/jewellerySlice'

type AddJewelleryData = {
  _id: any
  category?: any
  jewelleryName?: string
  brand?: string
  color?: string
  size?: string
  sku?: string
  price?: string
  shape?: string
  description?: any
  images?: any
}

type AddJewelleryProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: AddJewelleryData
}

const initialAddressData: AddJewelleryProps['data'] = {
  _id: '',
  category: '',
  jewelleryName: '',
  brand: '',
  color: '',
  size: '',
  sku: '',
  price: '',
  description: '',
  shape: '',
  images: []
}

const customInputData: CustomInputVerticalData[] = [
  {
    title: 'Home',
    content: 'Delivery Time (7am - 9pm)',
    value: 'home',
    isSelected: true,
    asset: 'tabler-home'
  },
  {
    title: 'Office',
    content: 'Delivery Time (10am - 6pm)',
    value: 'office',
    asset: 'tabler-building-skyscraper'
  }
]

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('tabler-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i
          className={classnames('tabler-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i
          className={classnames('tabler-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i
          className={classnames('tabler-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i
          className={classnames('tabler-align-justified', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton>
    </div>
  )
}

const AddJewellery = ({ open, setOpen, data }: AddJewelleryProps) => {
  // Vars
  const initialSelected: string = customInputData?.find(item => item.isSelected)?.value || ''

  // States
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string>(initialSelected)
  const [jewelleryData, setJewelleryData] = useState<AddJewelleryProps['data']>(initialAddressData)
  const [categoryData, setCategoryData] = useState<any>([])
  const dispatch = useDispatch<AppDispatch>()

  // Useselector
  const { loading, fetchCategoriesData } = useSelector((state: RootState) => ({
    loading: state.jewllerySlice.loading,
    fetchCategoriesData: state.categorySlice.fetchCategoriesData
  }))

  useEffect(() => {
    if (open && categoryData.length === 0) {
      const filter = { parent: '67a11573f8bba178b89e62c9' }

      dispatch(fetchCategories(filter)).then(res => {
        if (res.type === 'category/fetchAll/fulfilled') {
          setCategoryData(res.payload)
        }
      })
    }

    if (open) {
      setJewelleryData(data ?? initialAddressData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data, categoryData.length, dispatch])

  // Hooks
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<AddJewelleryData>({
    defaultValues: {
      _id: '',
      category: '',
      jewelleryName: '',
      brand: '',
      color: '',
      size: '',
      sku: '',
      price: '',
      description: data?.description || ''
    }
  })

  const editor: any = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    immediatelyRender: false,
    content: data?.description || '<p>Write your description here...</p>',
    onUpdate: ({ editor }) => {
      setValue('description', editor.getHTML())
    }
  })

  useEffect(() => {
    if (open && data) {
      reset({
        _id: data._id || '',
        category: data.category || '',
        jewelleryName: data.jewelleryName || '',
        brand: data.brand || '',
        color: data.color || '',
        size: data.size || '',
        sku: data.sku || '',
        price: data.price || '',
        description: data.description || ''
      })
    } else if (open) {
      // Reset to initial values if no data provided
      reset({
        _id: '',
        category: '',
        jewelleryName: '',
        brand: '',
        color: '',
        size: '',
        sku: '',
        price: '',
        description: ''
      })
    }
  }, [open, data, reset])

  useEffect(() => {
    if (fetchCategoriesData.length > 0) {
      setCategoryData(fetchCategoriesData)
    }
  }, [fetchCategoriesData])
  console.log('fetchCategoriesData :==> ', fetchCategoriesData)

  useEffect(() => {
    if (editor && data?.description) {
      editor.commands.setContent(data.description)
      setValue('description', data.description)
    }

    // return () => editor?.off('update'); // Clean up the event listener
  }, [editor, data, setValue])

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      if (jewelleryData?.images === undefined || jewelleryData.images.length === 0) {
        toast.error('Please upload at least one image.')

        return
      }

      const form = new FormData()

      // Assuming jewelleryData is an object, loop through it to append each field
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== '_id') {
          form.append(key, formData[key])
        }
      }

      // If jewelleryData.images exists and is an array of File objects (for image uploads)
      if (jewelleryData.images && Array.isArray(jewelleryData.images)) {
        jewelleryData.images.forEach((image: File) => {
          form.append('images', image) // Appending each image as 'images' key
        })
      }

      // Check if we are in edit mode (i.e., _id exists in data)
      if (data != undefined) {
        dispatch(updateJewellery({ id: data._id, formData: form })).then(res => {
          if (res.type === 'jewellery/update/fulfilled') {
            reset()
            setOpen(false)
            setJewelleryData(initialAddressData)
          }
        })
      } else {
        dispatch(createJewellery(form)).then(res => {
          if (res.type === 'jewellery/create/fulfilled') {
            reset()
            setOpen(false)
            setJewelleryData(initialAddressData)
          }
        })
      }
    } catch (error: any) {
      console.log('Error posting data:', error)

      // Optionally handle error (show error message, etc.)
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth='md'
      scroll='body'
      onClose={() => {
        setOpen(false)
        setSelected(initialSelected)
      }}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {data ? 'Edit Jewellery' : 'Add New Jewellery'}
        <Typography component='span' className='flex flex-col text-center'>
          {data ? 'Edit Jewellery' : 'Add newest launched jewellery'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='pbs-0 sm:pli-16'>
          <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='category'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Category'
                    variant='outlined'
                    {...field}
                    error={Boolean(errors.category)}
                  >
                    {categoryData?.map((category: any, index: any) => (
                      <MenuItem key={index} value={category?._id}>
                        {category?.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
              {errors.shape && <FormHelperText error>This field is required.</FormHelperText>}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='jewelleryName'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Jewellery Name'
                    variant='outlined'
                    placeholder='Bracelet'
                    {...field}
                    {...(errors.jewelleryName && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name='brand'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Brand'
                    variant='outlined'
                    placeholder='Brand'
                    {...field}
                    {...(errors.brand && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl component='fieldset'>
                <FormLabel component='legend' error={Boolean(errors.color)}>
                  Select Color
                </FormLabel>
                <Controller
                  name='color'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      {[
                        { label: 'Red', value: 'red' },
                        { label: 'Blue', value: 'blue' },
                        { label: 'Green', value: 'green' },
                        { label: 'Yellow', value: 'yellow' },
                        { label: 'Black', value: 'black' },
                        { label: 'White', value: 'white' },
                        { label: 'Pink', value: 'pink' }
                      ].map((color, index) => (
                        <FormControlLabel
                          key={index}
                          value={color.value}
                          control={
                            <Radio
                              sx={{
                                color: color.value,
                                '&.Mui-checked': {
                                  color: color.value
                                }
                              }}
                            />
                          }
                          label={
                            <span className='flex items-center gap-2' style={{ textTransform: 'capitalize' }}>
                              <span
                                className='w-4 h-4 rounded-full'
                                style={{
                                  backgroundColor: color.value,
                                  display: 'inline-block',
                                  border: '1px solid #ddd'
                                }}
                              ></span>
                              {color.label}
                            </span>
                          }
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.color && <FormHelperText error>This field is required.</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='size'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Size'
                    variant='outlined'
                    {...field}
                    error={Boolean(errors.size)}
                  >
                    {['S', 'M', 'L', 'XL'].map((size, index) => (
                      <MenuItem key={index} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
              {errors.size && <FormHelperText error>This field is required.</FormHelperText>}
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='sku'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='SKU'
                    variant='outlined'
                    placeholder='MNK-001'
                    {...field}
                    {...(errors.sku && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='price'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    type='number'
                    inputProps={{ min: 0 }}
                    fullWidth
                    label='Price'
                    variant='outlined'
                    placeholder='₹ 199'
                    {...field}
                    {...(errors.price && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography className='mbe-1'>Description (Optional)</Typography>
              <Card className='p-0 border shadow-none'>
                <CardContent className='p-0'>
                  <EditorToolbar editor={editor} />
                  <Divider className='mli-6' />
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <EditorContent
                        editor={editor}
                        className='bs-[135px] overflow-y-auto flex '
                        {...field} // Passing the field from react-hook-form to the EditorContent
                      />
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ProductImage setJewelleryData={setJewelleryData} jewelleryData={jewelleryData} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color='inherit' />}
            type='submit'
          >
            {loading ? 'Submitting...' : data ? 'Update' : 'Submit'}
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            disabled={loading}
            onClick={() => {
              setOpen(false)
              setSelected(initialSelected)
            }}
            type='reset'
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddJewellery
