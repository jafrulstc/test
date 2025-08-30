// src/features/person/pages/PersonReportPage.tsx
import React, { useEffect, useMemo, useRef, useState, memo, useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    Avatar,
    Card,
    CardContent,
    Pagination,
} from '@mui/material';
import {
    Print,
    FileDownload,
    Search,
    FilterList,
    Person as PersonIcon,
    Refresh,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';

import {
    selectPersonState,
    selectPersons,
    fetchPersons,
    setFilters as setPersonFilters,
    setPagination as setPersonPagination,
} from '~/features/education/person/store/personSlice';

import {
    selectGenders,
    selectBloodGroups,
    selectReligions,
    selectPersonCategories,
    selectDesignationCategories,
    selectDesignations,
    fetchAllSimpleEntities,
} from '~/features/core/store/generalSlice';

import {
    selectNationalities,
    fetchNationalities,
} from '~/features/core/store/geographySlice';

import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { exportToCsv } from '~/shared/utils/exportUtils';
import { printTable } from '~/shared/utils/printUtils';

import type { Person, PersonFilter } from '~/features/education/person/types/personType';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';
import { getStatusColor } from '~/features/boarding/core/components/utils/masterBoardingUtils';

/**
 * Person Report Page
 */
const PersonReportPage = memo(() => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { showToast } = useToastContext();
    const tableRef = useRef<HTMLTableElement>(null);

    const { loading, filters, pagination } = useAppSelector(selectPersonState);
    const persons = useAppSelector(selectPersons);

    const genders = useAppSelector(selectGenders);
    const bloodGroups = useAppSelector(selectBloodGroups);
    const religions = useAppSelector(selectReligions);
    const nationalities = useAppSelector(selectNationalities);

    const personCategories = useAppSelector(selectPersonCategories);
    const designationCategories = useAppSelector(selectDesignationCategories);
    const designations = useAppSelector(selectDesignations);

    // Filters (local UI state)
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [personCategoryFilter, setPersonCategoryFilter] = useState('');
    const [designationCategoryFilter, setDesignationCategoryFilter] = useState('');
    const [designationFilter, setDesignationFilter] = useState('');

    const debouncedSearch = useDebounce(searchTerm, 300);

    // when category changes, reset designation pick
    useEffect(() => {
        setDesignationFilter('');
    }, [designationCategoryFilter]);
    // when person category changes, if not 'staff' then clear designation filters
    useEffect(() => {
        if (personCategoryFilter !== 'staff') {
            setDesignationCategoryFilter('');
            setDesignationFilter('');
        }
    }, [personCategoryFilter]);

    // when category changes, reset designation pick
    useEffect(() => {
        setDesignationFilter('');
    }, [designationCategoryFilter]);

    // Fetch master data
    useEffect(() => {
        if (
            genders.length === 0 ||
            bloodGroups.length === 0 ||
            religions.length === 0 ||
            personCategories.length === 0 ||
            designationCategories.length === 0 ||
            designations.length === 0
        ) {
            dispatch(fetchAllSimpleEntities());
        }
        if (nationalities.length === 0) {
            dispatch(fetchNationalities({ page: 1, limit: 1000, filters: {} }));
        }
    }, [
        dispatch,
        genders.length,
        bloodGroups.length,
        religions.length,
        personCategories.length,
        designationCategories.length,
        designations.length,
        nationalities.length,
    ]);

    // Push filter changes to store
    useEffect(() => {
        const newFilters: PersonFilter = {
            search: debouncedSearch || undefined,
            status: STATUSES_OBJECT.ACTIVE || undefined,
            genderId: genderFilter || undefined,
            personCategoryId: personCategoryFilter || undefined,
            designationCategoryId: designationCategoryFilter || undefined,
            designationId: designationFilter || undefined,
        };

        if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
            dispatch(setPersonFilters(newFilters));
        }
    }, [
        debouncedSearch,
        statusFilter,
        genderFilter,
        personCategoryFilter,
        designationCategoryFilter,
        designationFilter,
        dispatch,
        filters,
    ]);

    // Fetch persons
    useEffect(() => {
        const fetchParams = {
            page: pagination.page,
            limit: pagination.limit,
            filters,
        };
        dispatch(fetchPersons(fetchParams));
    }, [dispatch, pagination.page, pagination.limit, filters]);

    // Derived: filtered designations by designationCategoryFilter
    const filteredDesignations = useMemo(() => {
        if (!designationCategoryFilter) return designations;
        return designations.filter(d => d.designationCategoryId === designationCategoryFilter);
    }, [designations, designationCategoryFilter]);

    // Helpers
    const getEntityName = (entities: any[], id?: string): string => {
        if (!id) return 'N/A';
        const ent = entities.find(e => e.id === id);
        return ent ? ent.name : 'N/A';
    };

    const calculateAge = (dateOfBirth?: string): number | 'N/A' => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birth = new Date(dateOfBirth);
        if (isNaN(birth.getTime())) return 'N/A';
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    // Actions
    const handlePageChange = useCallback(
        (_: React.ChangeEvent<unknown>, page: number) => {
            dispatch(setPersonPagination({ page }));
        },
        [dispatch]
    );

    const handleRefresh = useCallback(() => {
        const fetchParams = {
            page: pagination.page,
            limit: pagination.limit,
            filters,
        };
        dispatch(fetchPersons(fetchParams));
        showToast('Person data refreshed', 'success');
    }, [dispatch, pagination.page, pagination.limit, filters, showToast]);

    const handleClearFilters = useCallback(() => {
        setSearchTerm('');
        setStatusFilter('');
        setGenderFilter('');
        setPersonCategoryFilter('');
        setDesignationCategoryFilter('');
        setDesignationFilter('');
        dispatch(setPersonFilters({}));
    }, [dispatch]);

    const handleExportCsv = useCallback(() => {
        if (persons.length === 0) {
            showToast('No data to export', 'warning');
            return;
        }
        const rows = persons.map((p: Person) => ({
            'First Name': p.firstName,
            'Last Name': p.lastName,
            'Father Name': p.fatherName,
            'Mother Name': p.motherName,
            'Date of Birth': p.dateOfBirth || 'N/A',
            'Age': typeof calculateAge(p.dateOfBirth) === 'number' ? `${calculateAge(p.dateOfBirth)}` : 'N/A',
            'Email': p.email || 'N/A',
            'Gender': getEntityName(genders, p.genderId),
            'Blood Group': getEntityName(bloodGroups, p.bloodGroupId),
            'Religion': getEntityName(religions, p.religionId),
            'Nationality': getEntityName(nationalities, p.nationalityId),
            'Person Category': getEntityName(personCategories, (p as any).personCategoryId),
            'Designation Category': getEntityName(designationCategories, (p as any).designationCategoryId),
            'Designation': getEntityName(designations, (p as any).designationId),
            'NID Number': p.nidNumber || 'N/A',
            'BRN Number': p.brnNumber || 'N/A',
            'Status': p.status,
            'Created Date': new Date(p.createdAt).toLocaleDateString(),
        }));
        const filename = `person-report-${new Date().toISOString().split('T')[0]}.csv`;
        exportToCsv(rows, filename);
        showToast('Person report exported successfully', 'success');
    }, [
        persons,
        genders,
        bloodGroups,
        religions,
        nationalities,
        personCategories,
        designationCategories,
        designations,
        showToast,
    ]);

    const handlePrint = useCallback(() => {
        if (!tableRef.current) {
            showToast('Unable to print report', 'error');
            return;
        }
        const subtitle = `Generated on ${new Date().toLocaleDateString()} | Total Records: ${pagination.total}`;
        printTable(tableRef.current, 'Person Report', subtitle);
    }, [pagination.total, showToast]);

    // KPIs
    const totalPersons = pagination.total;
    const activeCount = persons.filter(p => p.status === STATUSES_OBJECT.ACTIVE).length;
    const inactiveCount = persons.filter(p => p.status === STATUSES_OBJECT.INACTIVE).length;
    const avgAge =
        persons.length > 0
            ? Math.round(
                persons.reduce((sum, p) => {
                    const a = calculateAge(p.dateOfBirth);
                    return sum + (typeof a === 'number' ? a : 0);
                }, 0) / persons.length
            )
            : 0;

    const isLoading = loading && persons.length === 0;
    if (isLoading) {
        return <LoadingSpinner message="Loading person report..." />;
    }

    const hasData = persons.length > 0;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Person Reports
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Comprehensive reporting for all persons (students, staff, guardians, mentors)
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Total Persons
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {totalPersons}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="success.main" gutterBottom>
                                Active
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {activeCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="warning.main" gutterBottom>
                                Inactive
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {inactiveCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Avg. Age
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {avgAge} yrs
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters & Actions */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Filters & Actions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh} disabled={loading}>
                            Refresh
                        </Button>
                        <Button variant="outlined" startIcon={<Print />} onClick={handlePrint} disabled={!hasData}>
                            Print Report
                        </Button>
                        <Button variant="contained" startIcon={<FileDownload />} onClick={handleExportCsv} disabled={!hasData}>
                            Export CSV
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search persons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="">All Status</MenuItem>
                                <MenuItem value={STATUSES_OBJECT.ACTIVE}>Active</MenuItem>
                                <MenuItem value={STATUSES_OBJECT.INACTIVE}>Inactive</MenuItem>
                                <MenuItem value={STATUSES_OBJECT.ARCHIVE}>Archive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={genderFilter}
                                label="Gender"
                                onChange={(e) => setGenderFilter(e.target.value)}
                            >
                                <MenuItem value="">All Genders</MenuItem>
                                {genders.map((g) => (
                                    <MenuItem key={g.id} value={g.id}>
                                        {g.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Person Category</InputLabel>
                            <Select
                                value={personCategoryFilter}
                                label="Person Category"
                                onChange={(e) => setPersonCategoryFilter(e.target.value)}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {personCategories.map((pc) => (
                                    <MenuItem key={pc.id} value={pc.id}>
                                        {pc.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth size="small" disabled={!personCategoryFilter}>
                            <InputLabel>Designation Category</InputLabel>
                            <Select
                                value={designationCategoryFilter}
                                label="Designation Category"
                                onChange={(e) => {
                                    setDesignationCategoryFilter(e.target.value);
                                    setDesignationFilter(''); // reset dependent designation
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {designationCategories
                                    .filter(dc => !personCategoryFilter || dc.name === personCategoryFilter)
                                    .map((dc) => (
                                        <MenuItem key={dc.id} value={dc.id}>
                                            {dc.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth size="small" disabled={!designationCategoryFilter}>
                            <InputLabel>Designation</InputLabel>
                            <Select
                                value={designationFilter}
                                label="Designation"
                                onChange={(e) => setDesignationFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {filteredDesignations.map((d) => (
                                    <MenuItem key={d.id} value={d.id}>
                                        {d.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="text" startIcon={<FilterList />} onClick={handleClearFilters} size="small">
                        Clear All Filters
                    </Button>
                </Box>
            </Paper>

            {/* Report Table */}
            {hasData ? (
                <>
                    <TableContainer component={Paper} variant="outlined">
                        <Table ref={tableRef} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Person</TableCell>
                                    <TableCell>Parents</TableCell>
                                    <TableCell>Demographics</TableCell>
                                    <TableCell>Category / Designation</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Age</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {persons.map((p) => (
                                    <TableRow key={p.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar src={p.photo || undefined} sx={{ width: 40, height: 40 }}>
                                                    <PersonIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {p.firstName} {p.lastName}
                                                    </Typography>
                                                    {p.nidNumber && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            NID: {p.nidNumber}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2">F: {p.fatherName}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    M: {p.motherName}
                                                </Typography>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2">{getEntityName(genders, p.genderId)}</Typography>
                                                {p.bloodGroupId && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {getEntityName(bloodGroups, p.bloodGroupId)}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2">
                                                    {getEntityName(personCategories, (p as any).personCategoryId)}
                                                </Typography>
                                                {(p as any).designationId && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {getEntityName(designations, (p as any).designationId)}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">{p.email || 'No email'}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">
                                                {calculateAge(p.dateOfBirth)} {typeof calculateAge(p.dateOfBirth) === 'number' ? 'years' : ''}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={p.status}
                                                size="small"
                                                color={getStatusColor(p.status)}
                                                variant="outlined"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={pagination.totalPages}
                                page={pagination.page}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}

                    {/* Report Summary */}
                    <Paper sx={{ p: 2, mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Showing {persons.length} of {pagination.total} persons
                            {Object.keys(filters).length > 0 && ' (filtered)'}
                        </Typography>
                    </Paper>
                </>
            ) : (
                <EmptyState
                    title="No persons found"
                    description="No persons match the current filters. Try adjusting your search criteria."
                    actionLabel="Clear Filters"
                    onAction={handleClearFilters}
                />
            )}
        </Box>
    );
});

PersonReportPage.displayName = 'PersonReportPage';

export { PersonReportPage };
